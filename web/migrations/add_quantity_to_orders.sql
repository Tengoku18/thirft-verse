-- Migration: Add quantity field to orders and payment_metadata tables
-- Created: 2025-01-XX
-- Description: Adds quantity column to support multiple items per order

-- Add quantity column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- Add comment to the column
COMMENT ON COLUMN orders.quantity IS 'Number of items purchased in this order';

-- Add quantity column to payment_metadata table
ALTER TABLE payment_metadata
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- Add comment to the column
COMMENT ON COLUMN payment_metadata.quantity IS 'Number of items being purchased';

-- Update existing records to have quantity = 1 (for backward compatibility)
UPDATE orders SET quantity = 1 WHERE quantity IS NULL;
UPDATE payment_metadata SET quantity = 1 WHERE quantity IS NULL;
