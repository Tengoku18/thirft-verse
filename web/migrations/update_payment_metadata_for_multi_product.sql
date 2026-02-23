-- Migration: Update payment_metadata to support multi-product orders
-- Created: 2026-02-09
-- Description: Adds cart_items field to store multiple products in payment metadata

-- Add cart_items column to store array of products (as JSONB)
ALTER TABLE payment_metadata
ADD COLUMN IF NOT EXISTS cart_items JSONB DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN payment_metadata.cart_items IS 'Array of cart items for multi-product orders. Each item contains: {product_id, product_name, quantity, price, cover_image}. NULL for single-product orders.';

-- Make product_id nullable since multi-product orders won't have a single product_id
ALTER TABLE payment_metadata
ALTER COLUMN product_id DROP NOT NULL;

-- Add comment to explain the change
COMMENT ON COLUMN payment_metadata.product_id IS 'Product ID for single-product orders. NULL for multi-product orders (use cart_items instead).';

-- Add a check to ensure either product_id OR cart_items is set (but not both NULL)
ALTER TABLE payment_metadata
ADD CONSTRAINT payment_metadata_product_or_cart_check
CHECK (
  (product_id IS NOT NULL AND cart_items IS NULL) OR
  (product_id IS NULL AND cart_items IS NOT NULL)
);

COMMENT ON CONSTRAINT payment_metadata_product_or_cart_check ON payment_metadata IS 'Ensures either product_id (single product) or cart_items (multiple products) is set, but not both.';
