-- Referral core schema + RLS (production baseline)

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referrer_email text not null,
  code text not null unique,
  is_active boolean not null default true,
  expires_at timestamptz null,
  max_redemptions integer null,
  created_at timestamptz not null default now(),
  constraint referrals_one_code_per_referrer unique (referrer_id),
  constraint referrals_max_redemptions_positive check (max_redemptions is null or max_redemptions > 0)
);

create table if not exists public.referral_users (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  referred_email text not null,
  commission_expires_at timestamptz not null default (now() + interval '1 year'),
  created_at timestamptz not null default now(),
  constraint referral_users_one_referral_per_user unique (referred_user_id)
);

create index if not exists idx_referrals_code on public.referrals(code);
create index if not exists idx_referrals_referrer on public.referrals(referrer_id);
create index if not exists idx_referral_users_referral_id_created_at
  on public.referral_users(referral_id, created_at desc);

alter table public.referrals enable row level security;
alter table public.referral_users enable row level security;

drop policy if exists referrals_select_policy on public.referrals;
create policy referrals_select_policy
on public.referrals
for select
using (
  referrer_id = auth.uid()
  or (
    is_active = true
    and (expires_at is null or expires_at > now())
  )
);

drop policy if exists referrals_insert_own on public.referrals;
create policy referrals_insert_own
on public.referrals
for insert
with check (referrer_id = auth.uid());

drop policy if exists referrals_update_own on public.referrals;
create policy referrals_update_own
on public.referrals
for update
using (referrer_id = auth.uid())
with check (referrer_id = auth.uid());

drop policy if exists referrals_delete_own on public.referrals;
create policy referrals_delete_own
on public.referrals
for delete
using (referrer_id = auth.uid());

drop policy if exists referral_users_select_owner_or_self on public.referral_users;
create policy referral_users_select_owner_or_self
on public.referral_users
for select
using (
  referred_user_id = auth.uid()
  or referral_id in (
    select r.id from public.referrals r where r.referrer_id = auth.uid()
  )
);

drop policy if exists referral_users_insert_self on public.referral_users;
create policy referral_users_insert_self
on public.referral_users
for insert
with check (referred_user_id = auth.uid());
