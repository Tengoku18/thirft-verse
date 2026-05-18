-- Consolidated, authoritative RLS for buyer/guest order INSERTs.
-- Supersedes 006 + 007. Idempotent: safe to run repeatedly.
--
-- Symptom this fixes:
--   42501 "new row violates row-level security policy for table \"orders\""
--   in createBuyerCodOrder. Root cause: 006/007 were never deployed to the
--   remote DB, so the orders table has RLS on but no INSERT policy for the
--   role making the request.

-- ============================================================
-- 1. DIAGNOSTIC  (run first; if the fix doesn't take, paste this output back)
-- ============================================================

-- Is RLS on / forced?
select relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from   pg_class
where  oid = 'public.orders'::regclass;

-- Every policy on orders. Watch for:
--   polcmd        : 'a'=INSERT 'r'=SELECT 'w'=UPDATE 'd'=DELETE '*'=ALL
--   polpermissive : t=PERMISSIVE  f=RESTRICTIVE  <-- a RESTRICTIVE insert
--                   policy is AND-ed in and will still block the buyer even
--                   after we add a permissive one. If you see one, drop it.
select polname,
       polcmd,
       polpermissive,
       pg_get_expr(polqual,      polrelid) as using_expr,
       pg_get_expr(polwithcheck, polrelid) as with_check_expr,
       (select array_agg(rolname) from pg_roles where oid = any(polroles)) as roles
from   pg_policy
where  polrelid = 'public.orders'::regclass
order  by polcmd, polname;

-- Table-level grants (RLS needs the privilege too).
select grantee, privilege_type
from   information_schema.role_table_grants
where  table_schema = 'public' and table_name = 'orders'
order  by grantee, privilege_type;

-- ============================================================
-- 2. FIX
-- ============================================================

alter table public.orders enable row level security;

-- Logged-in buyer (mobile app always logs in).
drop policy if exists "authenticated users can place orders" on public.orders;
create policy "authenticated users can place orders"
  on public.orders for insert to authenticated with check (true);

-- Logged-out / guest checkout (web). Postgres OR-combines permissive
-- policies, so this never weakens the authenticated path.
drop policy if exists "anonymous users can place orders" on public.orders;
create policy "anonymous users can place orders"
  on public.orders for insert to anon with check (true);

-- Belt-and-suspenders: RLS only applies once the role has the table
-- privilege. (If this were the missing piece you'd see "permission denied
-- for table orders" instead, but granting is harmless and idempotent.)
grant insert on public.orders to authenticated, anon;

-- ============================================================
-- 3. VERIFY  (must list BOTH insert policies after running section 2)
-- ============================================================
select polname,
       (select array_agg(rolname) from pg_roles where oid = any(polroles)) as roles
from   pg_policy
where  polrelid = 'public.orders'::regclass and polcmd = 'a'
order  by polname;
