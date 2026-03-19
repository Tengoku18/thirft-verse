-- Referral atomic RPCs + audit + throttling

create table if not exists public.referral_events (
  id bigserial primary key,
  referral_id uuid null references public.referrals(id) on delete set null,
  actor_user_id uuid null references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_apply_attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  success boolean not null,
  error_code text null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_referral_events_referral_created
  on public.referral_events(referral_id, created_at desc);
create index if not exists idx_referral_apply_attempts_user_time
  on public.referral_apply_attempts(user_id, attempted_at desc);

create or replace function public.log_referral_event(
  p_referral_id uuid,
  p_actor_user_id uuid,
  p_event_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.referral_events(referral_id, actor_user_id, event_type, metadata)
  values (p_referral_id, p_actor_user_id, p_event_type, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public.change_referral_code_atomic(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referral_id uuid;
  v_usage_count integer;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'not_authenticated');
  end if;

  if auth.uid() <> p_user_id then
    return jsonb_build_object('success', false, 'error', 'unauthorized');
  end if;

  select id into v_referral_id
  from public.referrals
  where referrer_id = p_user_id
  for update;

  if v_referral_id is null then
    return jsonb_build_object('success', true, 'deleted', false, 'reason', 'no_code');
  end if;

  select count(*)::integer into v_usage_count
  from public.referral_users
  where referral_id = v_referral_id;

  if v_usage_count > 0 then
    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_code_change_blocked_used', jsonb_build_object('usage_count', v_usage_count));
    return jsonb_build_object('success', false, 'error', 'code_used');
  end if;

  delete from public.referrals where id = v_referral_id;
  perform public.log_referral_event(v_referral_id, p_user_id, 'referral_code_deleted', '{}'::jsonb);

  return jsonb_build_object('success', true, 'deleted', true);
end;
$$;

create or replace function public.toggle_referral_code_atomic(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referral_id uuid;
  v_is_active boolean;
  v_new_active boolean;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'not_authenticated');
  end if;

  if auth.uid() <> p_user_id then
    return jsonb_build_object('success', false, 'error', 'unauthorized');
  end if;

  select id, is_active into v_referral_id, v_is_active
  from public.referrals
  where referrer_id = p_user_id
  for update;

  if v_referral_id is null then
    return jsonb_build_object('success', false, 'error', 'no_code');
  end if;

  v_new_active := not coalesce(v_is_active, true);

  update public.referrals
  set is_active = v_new_active
  where id = v_referral_id;

  perform public.log_referral_event(
    v_referral_id,
    p_user_id,
    case when v_new_active then 'referral_code_reactivated' else 'referral_code_deactivated' end,
    jsonb_build_object('previous_is_active', coalesce(v_is_active, true), 'new_is_active', v_new_active)
  );

  return jsonb_build_object('success', true, 'is_active', v_new_active);
end;
$$;

create or replace function public.apply_referral_code_atomic(
  p_code text,
  p_user_id uuid,
  p_user_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_referral_id uuid;
  v_referrer_id uuid;
  v_is_active boolean;
  v_expires_at timestamptz;
  v_max_redemptions integer;
  v_redemption_count integer;
  v_recent_failed_attempts integer;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'not_authenticated');
  end if;

  if auth.uid() <> p_user_id then
    return jsonb_build_object('success', false, 'error', 'unauthorized');
  end if;

  v_code := upper(trim(coalesce(p_code, '')));

  select count(*)::integer
    into v_recent_failed_attempts
  from public.referral_apply_attempts
  where user_id = p_user_id
    and success = false
    and attempted_at > now() - interval '15 minutes';

  if v_recent_failed_attempts >= 10 then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'throttled');
    return jsonb_build_object('success', false, 'error', 'throttled');
  end if;

  if v_code = '' then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'invalid_code');
    return jsonb_build_object('success', false, 'error', 'invalid_code');
  end if;

  select id, referrer_id, is_active, expires_at, max_redemptions
    into v_referral_id, v_referrer_id, v_is_active, v_expires_at, v_max_redemptions
  from public.referrals
  where code = v_code
  for update;

  if v_referral_id is null then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'invalid_code');
    return jsonb_build_object('success', false, 'error', 'invalid_code');
  end if;

  if not coalesce(v_is_active, true) then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'inactive');
    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_apply_rejected_inactive', '{}'::jsonb);
    return jsonb_build_object('success', false, 'error', 'inactive');
  end if;

  if v_expires_at is not null and v_expires_at <= now() then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'expired');
    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_apply_rejected_expired', '{}'::jsonb);
    return jsonb_build_object('success', false, 'error', 'expired');
  end if;

  if v_referrer_id = p_user_id then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'self_referral');
    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_apply_rejected_self', '{}'::jsonb);
    return jsonb_build_object('success', false, 'error', 'self_referral');
  end if;

  select count(*)::integer into v_redemption_count
  from public.referral_users
  where referral_id = v_referral_id;

  if v_max_redemptions is not null and v_redemption_count >= v_max_redemptions then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, false, 'max_redemptions_reached');
    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_apply_rejected_limit_reached', '{}'::jsonb);
    return jsonb_build_object('success', false, 'error', 'max_redemptions_reached');
  end if;

  begin
    insert into public.referral_users(referral_id, referred_user_id, referred_email)
    values (v_referral_id, p_user_id, lower(trim(coalesce(p_user_email, ''))));

    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, true, null);

    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_applied', '{}'::jsonb);
  exception when unique_violation then
    insert into public.referral_apply_attempts(user_id, code, success, error_code)
    values (p_user_id, v_code, true, 'already_applied');

    perform public.log_referral_event(v_referral_id, p_user_id, 'referral_apply_idempotent', '{}'::jsonb);

    return jsonb_build_object('success', true, 'already_applied', true);
  end;

  return jsonb_build_object('success', true, 'already_applied', false);
end;
$$;

grant execute on function public.log_referral_event(uuid, uuid, text, jsonb) to authenticated;
grant execute on function public.change_referral_code_atomic(uuid) to authenticated;
grant execute on function public.toggle_referral_code_atomic(uuid) to authenticated;
grant execute on function public.apply_referral_code_atomic(text, uuid, text) to authenticated;
