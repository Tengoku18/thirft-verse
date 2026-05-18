-- Allow any authenticated user to INSERT an order (buyer-initiated purchases).
-- Previously only sellers could insert orders (enforced at the code level in createCustomOrder).
-- This policy enables native in-app COD checkout without exposing the service-role key on mobile.
--
-- Idempotent: safe to run multiple times. Without this policy, a logged-in
-- buyer placing an order hits:
--   "new row violates row-level security policy for table 'orders'"

-- Make sure RLS is on (it must be, for the policy to be meaningful).
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop the old version if it exists so this file can be re-applied cleanly.
DROP POLICY IF EXISTS "authenticated users can place orders" ON orders;

CREATE POLICY "authenticated users can place orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
