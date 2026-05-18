-- Migration: Add condition tier to products
-- Sellers must categorize each item by how worn it is (Thriftverse listing policy):
--   brand_new     - Unworn and unused, with the original tags still attached.
--   like_new      - No tags, but shows no signs of wear.
--   gently_used   - Worn a few times with only minor signs of wear.
--   thrifted_chic - Visible character or vintage wear that adds to its charm.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS condition TEXT
  CHECK (condition IN ('brand_new', 'like_new', 'gently_used', 'thrifted_chic'));

COMMENT ON COLUMN products.condition IS 'Item wear tier per Thriftverse listing policy: brand_new | like_new | gently_used | thrifted_chic. Nullable for legacy rows created before this field existed.';
