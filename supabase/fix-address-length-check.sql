-- =====================================================
-- Fix Address Length Check Constraint
-- =====================================================
-- Run this in Supabase SQL Editor to fix the address_length_check
-- constraint that's blocking profile updates
-- =====================================================

-- Step 1: Check the current constraint (view the limit)
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
AND contype = 'c';

-- Step 2: Drop the existing address_length_check constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS address_length_check;

-- Step 3: Add a new constraint with a reasonable limit (255 characters)
ALTER TABLE public.profiles
ADD CONSTRAINT address_length_check
CHECK (char_length(address) <= 255);

-- Verify the constraint was updated
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
AND conname = 'address_length_check';
