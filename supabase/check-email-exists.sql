-- Function to check if an email exists in auth.users table
-- This function is used by the forgot password flow to verify email exists before sending reset code

CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = LOWER(TRIM(email_to_check))
  );
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.check_email_exists(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_email_exists(TEXT) TO authenticated;

-- Add a comment for documentation
COMMENT ON FUNCTION public.check_email_exists(TEXT) IS 'Checks if an email exists in auth.users table. Used for forgot password flow validation.';
