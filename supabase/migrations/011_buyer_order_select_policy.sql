-- Buyers can read their own orders (the "purchase" side of an order).
--
-- An `orders` row is simultaneously the seller's sale and the buyer's
-- purchase. The only SELECT policy was "Sellers can view their orders."
-- (seller_id = auth.uid()), so a logged-in buyer reading an order they
-- placed matched no policy -> 0 rows -> PGRST116 in getOrderById and
-- getOrdersByBuyer.
--
-- There is no buyer user-id column; the buyer's identity is `buyer_email`,
-- which at checkout defaults to the logged-in account email
-- (app/checkout.tsx). Some insert paths lowercase the email and others do
-- not, so match case-insensitively.
--
-- PERMISSIVE: PostgreSQL OR-combines this with the seller SELECT policy, so
-- sellers keep seeing their sales unchanged and buyers additionally see
-- their purchases. No application code changes are needed -- existing
-- `.from("orders").select()...` reads start returning the buyer's rows.

drop policy if exists "buyers can view their own orders" on public.orders;
create policy "buyers can view their own orders"
  on public.orders
  for select
  to authenticated
  using (lower(buyer_email) = lower(auth.jwt() ->> 'email'));
