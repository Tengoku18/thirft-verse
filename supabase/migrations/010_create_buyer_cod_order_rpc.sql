-- Buyer-initiated COD order creation as a SECURITY DEFINER RPC.
--
-- Why: a raw client-side INSERT into `orders` is gated by RLS, and the
-- buyer also can't SELECT the row back (no buyer SELECT policy), which
-- breaks `.insert().select().single()`. Mirrors the 008 pattern: run the
-- write server-side as the function owner so RLS is bypassed cleanly, and
-- recompute money + re-resolve the offer here so the client can't tamper.
--
-- Faithfully reproduces lib/database-helpers.ts createBuyerCodOrder:
--   itemsSubtotal      = price * qty            (price read from products)
--   discount           = re-resolved via validate_offer_code_for_checkout
--   discountedTotal    = itemsSubtotal - discount
--   amount             = discountedTotal + shippingFee
--   platform_earnings  = round(discountedTotal * 0.05)
--   sellers_earning    = discountedTotal - platform_earnings
-- Stock decrement stays non-blocking (matches the current JS behaviour:
-- it skips the decrement if short, it does not fail the order).

CREATE OR REPLACE FUNCTION public.create_buyer_cod_order(
  p_product_id uuid,
  p_seller_id uuid,
  p_quantity integer,
  p_buyer_name text,
  p_buyer_email text,
  p_buyer_phone text,
  p_street text,
  p_city text,
  p_district text,
  p_shipping_option text,
  p_shipping_fee numeric,
  p_order_code text,
  p_buyer_notes text DEFAULT NULL,
  p_offer_code text DEFAULT NULL
)
RETURNS TABLE (id uuid, order_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product products%ROWTYPE;
  v_items_subtotal numeric;
  v_discount_amount numeric := 0;
  v_offer record;
  v_offer_code_id uuid := NULL;
  v_offer_code_text text := NULL;
  v_offer_discount_percent numeric := NULL;
  v_discounted_items_total numeric;
  v_total_amount numeric;
  v_platform_fee numeric;
  v_sellers_earning numeric;
  v_shipping_address jsonb;
  v_order_id uuid;
BEGIN
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'invalid quantity';
  END IF;

  SELECT * INTO v_product FROM products WHERE products.id = p_product_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'product not found';
  END IF;

  -- Price is authoritative from the DB, never trusted from the client.
  v_items_subtotal := round(v_product.price::numeric * p_quantity, 2);

  -- Re-resolve the offer server-side (tamper-proof), reusing 008's validator.
  IF p_offer_code IS NOT NULL AND btrim(p_offer_code) <> '' THEN
    SELECT *
      INTO v_offer
      FROM validate_offer_code_for_checkout(p_seller_id, p_offer_code, v_items_subtotal);
    IF FOUND THEN
      v_discount_amount       := v_offer.discount_amount;
      v_offer_code_id         := v_offer.offer_code_id;
      v_offer_code_text       := v_offer.code;
      v_offer_discount_percent := v_offer.discount_percent;
    END IF;
  END IF;

  v_discounted_items_total := v_items_subtotal - v_discount_amount;
  v_total_amount           := v_discounted_items_total + coalesce(p_shipping_fee, 0);
  v_platform_fee           := round(v_discounted_items_total * 0.05);
  v_sellers_earning        := v_discounted_items_total - v_platform_fee;

  v_shipping_address := jsonb_build_object(
    'street',  p_street,
    'city',    p_city,
    'district', p_district,
    'country', 'Nepal',
    'phone',   p_buyer_phone
  );
  IF p_buyer_notes IS NOT NULL AND btrim(p_buyer_notes) <> '' THEN
    v_shipping_address := v_shipping_address || jsonb_build_object('notes', p_buyer_notes);
  END IF;

  INSERT INTO orders (
    seller_id, product_id, quantity, buyer_email, buyer_name,
    shipping_address, transaction_code, transaction_uuid, amount,
    shipping_fee, items_subtotal, discounted_items_total, shipping_option,
    payment_method, status, order_code, sellers_earning, platform_earnings,
    offer_code_id, offer_code_text, offer_discount_percent, offer_discount_amount
  )
  VALUES (
    p_seller_id, p_product_id, p_quantity, p_buyer_email, p_buyer_name,
    v_shipping_address, NULL, NULL, v_total_amount,
    coalesce(p_shipping_fee, 0), v_items_subtotal, v_discounted_items_total, p_shipping_option,
    'cod', 'pending', p_order_code, v_sellers_earning, v_platform_fee,
    CASE WHEN v_discount_amount > 0 THEN v_offer_code_id END,
    CASE WHEN v_discount_amount > 0 THEN v_offer_code_text END,
    CASE WHEN v_discount_amount > 0 THEN v_offer_discount_percent END,
    CASE WHEN v_discount_amount > 0 THEN v_discount_amount END
  )
  RETURNING orders.id INTO v_order_id;

  -- Offer usage (idempotent on order_id, mirrors the JS path).
  IF v_discount_amount > 0 THEN
    PERFORM record_offer_code_usage(
      v_offer_code_id, p_seller_id, v_order_id, p_buyer_email,
      v_items_subtotal, v_offer_discount_percent, v_discount_amount,
      v_discounted_items_total, v_total_amount
    );
  END IF;

  -- Non-blocking stock decrement (same guard as the JS version).
  IF coalesce(v_product.availability_count, 0) >= p_quantity THEN
    UPDATE products
       SET availability_count = availability_count - p_quantity
     WHERE products.id = p_product_id;
  END IF;

  id := v_order_id;
  order_code := p_order_code;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_buyer_cod_order(
  uuid, uuid, integer, text, text, text, text, text, text, text, numeric, text, text, text
) TO anon, authenticated;
