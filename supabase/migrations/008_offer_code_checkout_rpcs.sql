-- Buyer-side offer-code support for native (mobile) checkout.
--
-- The web app validates offer codes with a service-role client (bypasses RLS).
-- The mobile app only has the buyer's anon/authenticated session, and RLS on
-- offer_codes does NOT let a buyer read another user's (seller's) codes. These
-- SECURITY DEFINER functions expose a tightly-scoped, read-controlled path so
-- the mobile checkout can validate a code and record its usage without
-- widening RLS on the underlying tables.
--
-- Mirrors web/src/actions/offer-codes.ts (resolveAppliedOfferForCheckout +
-- recordOfferCodeUsage) so both clients behave identically.

-- ── Validate an offer code for a given seller + cart subtotal ──────────────
-- Returns a single row with the resolved discount, or no rows if invalid.
CREATE OR REPLACE FUNCTION public.validate_offer_code_for_checkout(
  p_seller_id uuid,
  p_code text,
  p_items_subtotal numeric
)
RETURNS TABLE (
  offer_code_id uuid,
  code text,
  discount_percent numeric,
  items_subtotal numeric,
  discount_amount numeric,
  discounted_items_total numeric,
  expires_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized text;
  v_row offer_codes%ROWTYPE;
  v_subtotal numeric;
  v_discount numeric;
BEGIN
  v_normalized := upper(btrim(p_code));

  -- Format guard mirrors OFFER_CODE_REGEX (^[A-Z0-9_-]{4,24}$).
  IF v_normalized !~ '^[A-Z0-9_-]{4,24}$' THEN
    RETURN;
  END IF;

  IF p_seller_id IS NULL THEN
    RETURN;
  END IF;

  v_subtotal := round(coalesce(p_items_subtotal, 0)::numeric, 2);
  IF v_subtotal <= 0 THEN
    RETURN;
  END IF;

  SELECT *
    INTO v_row
    FROM offer_codes
   WHERE owner_user_id = p_seller_id
     AND code_normalized = v_normalized
     AND deleted_at IS NULL
   LIMIT 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF v_row.expires_at <= now() THEN
    RETURN;
  END IF;

  IF v_row.discount_percent <= 0 OR v_row.discount_percent > 90 THEN
    RETURN;
  END IF;

  v_discount := round(v_subtotal * (v_row.discount_percent / 100.0), 2);

  offer_code_id := v_row.id;
  code := v_row.code;
  discount_percent := v_row.discount_percent;
  items_subtotal := v_subtotal;
  discount_amount := v_discount;
  discounted_items_total := round(v_subtotal - v_discount, 2);
  expires_at := v_row.expires_at;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_offer_code_for_checkout(uuid, text, numeric)
  TO anon, authenticated;

-- ── Record offer-code usage for a created order ───────────────────────────
-- Idempotent on order_id (mirrors the web upsert onConflict: 'order_id').
CREATE OR REPLACE FUNCTION public.record_offer_code_usage(
  p_offer_code_id uuid,
  p_owner_user_id uuid,
  p_order_id uuid,
  p_client_email text,
  p_items_subtotal numeric,
  p_discount_percent numeric,
  p_discount_amount numeric,
  p_discounted_items_total numeric,
  p_final_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO offer_code_usages (
    offer_code_id,
    owner_user_id,
    client_email,
    order_id,
    items_subtotal,
    discount_percent,
    discount_amount,
    discounted_items_total,
    final_amount
  )
  VALUES (
    p_offer_code_id,
    p_owner_user_id,
    p_client_email,
    p_order_id,
    round(coalesce(p_items_subtotal, 0)::numeric, 2),
    p_discount_percent,
    round(coalesce(p_discount_amount, 0)::numeric, 2),
    round(coalesce(p_discounted_items_total, 0)::numeric, 2),
    round(coalesce(p_final_amount, 0)::numeric, 2)
  )
  ON CONFLICT (order_id) DO UPDATE SET
    offer_code_id = excluded.offer_code_id,
    owner_user_id = excluded.owner_user_id,
    client_email = excluded.client_email,
    items_subtotal = excluded.items_subtotal,
    discount_percent = excluded.discount_percent,
    discount_amount = excluded.discount_amount,
    discounted_items_total = excluded.discounted_items_total,
    final_amount = excluded.final_amount;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_offer_code_usage(
  uuid, uuid, uuid, text, numeric, numeric, numeric, numeric, numeric
) TO anon, authenticated;
