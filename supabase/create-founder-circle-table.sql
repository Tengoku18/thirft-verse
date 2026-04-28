-- =====================================================
-- Thriftverse Founder Circle Applications Table
-- =====================================================
-- Stores early-access applications for the Founder Circle
-- program. Applicants choose a role (creator / seller),
-- provide contact details and at least one social link.
-- Admins review and approve applications via the service role.
-- =====================================================

-- =====================================================
-- 1. CREATE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.founder_circle_applications (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Applicant details
  full_name        TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email            TEXT        NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),

  -- Role flags (at least one must be true — enforced by constraint)
  is_creator       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_seller        BOOLEAN     NOT NULL DEFAULT FALSE,

  -- Social profiles (at least one must be non-null — enforced by constraint)
  instagram_link   TEXT,
  tiktok_link      TEXT,
  other_link       TEXT,

  -- Admin fields
  is_approved      BOOLEAN     NOT NULL DEFAULT FALSE,
  approved_at      TIMESTAMPTZ,
  founder_access_code TEXT UNIQUE,
  admin_notes      TEXT,

  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT at_least_one_role CHECK (is_creator OR is_seller),
  CONSTRAINT at_least_one_social CHECK (
    instagram_link IS NOT NULL OR
    tiktok_link    IS NOT NULL OR
    other_link     IS NOT NULL
  )
);

-- =====================================================
-- 2. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_fc_applications_email
  ON public.founder_circle_applications (email);

CREATE INDEX IF NOT EXISTS idx_fc_applications_is_approved
  ON public.founder_circle_applications (is_approved);

CREATE INDEX IF NOT EXISTS idx_fc_applications_created_at
  ON public.founder_circle_applications (created_at DESC);

-- =====================================================
-- 3. AUTO-UPDATE updated_at TRIGGER
-- =====================================================
-- Reuse the shared handle_updated_at() function if it exists,
-- otherwise create it here.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.founder_circle_applications;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.founder_circle_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-populate approved_at when is_approved flips to true
CREATE OR REPLACE FUNCTION public.handle_fc_approved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_approved = TRUE AND OLD.is_approved = FALSE THEN
    NEW.approved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_fc_approved_at ON public.founder_circle_applications;

CREATE TRIGGER set_fc_approved_at
  BEFORE UPDATE ON public.founder_circle_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_fc_approved_at();

-- =====================================================
-- 4. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.founder_circle_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (public insert)
DROP POLICY IF EXISTS "Allow public insert" ON public.founder_circle_applications;
CREATE POLICY "Allow public insert"
  ON public.founder_circle_applications
  FOR INSERT
  WITH CHECK (true);

-- Only the service role (admin) can read or modify applications
DROP POLICY IF EXISTS "Service role full access" ON public.founder_circle_applications;
CREATE POLICY "Service role full access"
  ON public.founder_circle_applications
  USING (auth.role() = 'service_role');

-- =====================================================
-- 5. COMMENTS
-- =====================================================
COMMENT ON TABLE  public.founder_circle_applications IS
  'Early-access applications for the Thriftverse Founder Circle program.';

COMMENT ON COLUMN public.founder_circle_applications.is_creator IS
  'Applicant is a content creator / influencer who will refer sellers.';

COMMENT ON COLUMN public.founder_circle_applications.is_seller IS
  'Applicant owns or operates a thrift store.';

COMMENT ON COLUMN public.founder_circle_applications.founder_access_code IS
  'Unique code issued to approved founders to unlock app benefits.';

COMMENT ON COLUMN public.founder_circle_applications.admin_notes IS
  'Internal notes added by the admin team during review.';
