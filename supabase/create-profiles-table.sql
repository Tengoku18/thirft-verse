-- =====================================================
-- ThriftVerse Profiles Table Setup
-- =====================================================
-- This SQL creates the profiles table and sets up automatic
-- profile creation when a user signs up via Supabase Auth
-- =====================================================

-- 1. CREATE PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  profile_image TEXT,
  currency TEXT DEFAULT 'NPR' NOT NULL,
  store_username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_store_username ON public.profiles(store_username);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. AUTO-UPDATE TIMESTAMP FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 4. AUTOMATIC PROFILE CREATION FUNCTION
-- =====================================================
-- This function creates a profile automatically when a user
-- completes OTP verification and metadata is set
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
      currency
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'username',
      COALESCE(NEW.raw_user_meta_data->>'bio', ''),
      NEW.raw_user_meta_data->>'profile_image',
      COALESCE(NEW.raw_user_meta_data->>'currency', 'NPR')
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      store_username = EXCLUDED.store_username,
      profile_image = EXCLUDED.profile_image,
      updated_at = NOW();

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile when user metadata is updated
-- This fires after OTP verification when we call updateUser()
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
