-- Migration: Add is_verified flow to profiles
-- Mirrors the same pattern already used on the products table.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_verified      BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verified_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by      UUID        REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for the explore-page query (filters on role + is_verified)
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified
  ON profiles (is_verified)
  WHERE is_verified = TRUE;

-- Comment for clarity
COMMENT ON COLUMN profiles.is_verified  IS 'Whether this store has been verified by an admin. Only verified stores appear on the public explore page.';
COMMENT ON COLUMN profiles.verified_at  IS 'Timestamp when the store was verified.';
COMMENT ON COLUMN profiles.verified_by  IS 'Admin user ID who verified this store.';
