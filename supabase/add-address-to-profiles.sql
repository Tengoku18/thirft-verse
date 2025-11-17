-- =====================================================
-- Add Address Column to Profiles Table
-- =====================================================
-- Run this migration if your profiles table already exists
-- This adds the address column that was missing
-- =====================================================

-- Add address column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';

-- Update the trigger function to include address
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if user has completed signup and has metadata
  IF NEW.raw_user_meta_data->>'name' IS NOT NULL
     AND NEW.raw_user_meta_data->>'username' IS NOT NULL THEN

    -- Insert profile record
    INSERT INTO public.profiles (
      id,
      name,
      store_username,
      bio,
      profile_image,
      currency,
      address
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'username',
      COALESCE(NEW.raw_user_meta_data->>'bio', ''),
      NEW.raw_user_meta_data->>'profile_image',
      COALESCE(NEW.raw_user_meta_data->>'currency', 'NPR'),
      COALESCE(NEW.raw_user_meta_data->>'address', '')
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      store_username = EXCLUDED.store_username,
      profile_image = EXCLUDED.profile_image,
      address = EXCLUDED.address,
      updated_at = NOW();

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
