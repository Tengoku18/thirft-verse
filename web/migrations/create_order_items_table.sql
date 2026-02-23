-- Migration: Create order_items table for multi-product orders
-- Created: 2026-02-09
-- Description: Adds order_items table to support multiple products per order
-- This maintains backward compatibility with existing single-product orders

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL, -- Store product name at time of purchase
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0), -- Price per unit at time of purchase
  cover_image TEXT, -- Product image at time of purchase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Add comments
COMMENT ON TABLE order_items IS 'Line items for orders, supporting multiple products per order';
COMMENT ON COLUMN order_items.product_name IS 'Product name at time of purchase (for historical reference)';
COMMENT ON COLUMN order_items.price IS 'Price per unit at time of purchase (in case price changes later)';
COMMENT ON COLUMN order_items.cover_image IS 'Product cover image at time of purchase';

-- Make product_id nullable in orders table for backward compatibility
-- Old orders will have product_id set, new multi-product orders will use order_items
ALTER TABLE orders
ALTER COLUMN product_id DROP NOT NULL;

-- Add comment to explain the change
COMMENT ON COLUMN orders.product_id IS 'Legacy field for single-product orders. For multi-product orders, use order_items table. NULL indicates a multi-product order.';

-- Migrate existing orders to order_items (optional - for consistency)
-- This creates order_items entries for all existing orders
INSERT INTO order_items (order_id, product_id, product_name, quantity, price, cover_image)
SELECT
  o.id as order_id,
  o.product_id,
  COALESCE(p.title, 'Unknown Product') as product_name,
  o.quantity,
  COALESCE(p.price, 0) as price,
  p.cover_image
FROM orders o
LEFT JOIN products p ON o.product_id = p.id
WHERE o.product_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Note: We keep product_id in orders for backward compatibility
-- New multi-product orders will have product_id = NULL and use order_items
