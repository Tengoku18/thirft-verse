-- Allow anonymous (guest) users to INSERT an order.
-- Used by the web app's guest checkout flow, where the buyer is not logged in.
-- The mobile app continues to use the existing 006 policy ("authenticated users
-- can place orders") since it always requires login.
--
-- Postgres RLS combines multiple permissive policies with OR, so this addition
-- does not affect or weaken the authenticated path — each role is gated by its
-- own policy.
CREATE POLICY "anonymous users can place orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);
