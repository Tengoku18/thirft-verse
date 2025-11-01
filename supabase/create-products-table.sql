-- =====================================================
-- ThriftVerse Products Table Migration
-- =====================================================
-- This migration creates the products table for storing
-- thrift items listed by users on the marketplace.
-- =====================================================

-- Create ENUM for product status
CREATE TYPE product_status AS ENUM ('available', 'out_of_stock');

-- =====================================================
-- 1. Create Products Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cover_image TEXT NOT NULL,
    other_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    availability_count INTEGER NOT NULL DEFAULT 1 CHECK (availability_count >= 0),
    status product_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT products_title_not_empty CHECK (title <> ''),
    CONSTRAINT products_category_not_empty CHECK (category <> '')
);

-- =====================================================
-- 2. Create Indexes for Better Performance
-- =====================================================

-- Index on store_id for quick lookup of user's products
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);

-- Index on status for filtering available products
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- Index on category for filtering by category
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Index on created_at for sorting by newest first
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Composite index for common queries (store + status)
CREATE INDEX IF NOT EXISTS idx_products_store_status ON public.products(store_id, status);

-- =====================================================
-- 3. Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. Create RLS Policies
-- =====================================================

-- Policy: Anyone can view available products
CREATE POLICY "Anyone can view available products"
    ON public.products
    FOR SELECT
    USING (status = 'available');

-- Policy: Store owners can view all their products (including out of stock)
CREATE POLICY "Users can view their own products"
    ON public.products
    FOR SELECT
    USING (auth.uid() = store_id);

-- Policy: Authenticated users can create products
CREATE POLICY "Authenticated users can create products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = store_id);

-- Policy: Users can only update their own products
CREATE POLICY "Users can update their own products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = store_id)
    WITH CHECK (auth.uid() = store_id);

-- Policy: Users can only delete their own products
CREATE POLICY "Users can delete their own products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (auth.uid() = store_id);

-- =====================================================
-- 5. Create Trigger for Auto-updating `updated_at`
-- =====================================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. Grant Permissions
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on products table
GRANT SELECT ON public.products TO anon;
GRANT ALL ON public.products TO authenticated;

-- Grant usage on the ENUM type
GRANT USAGE ON TYPE product_status TO anon, authenticated;

-- =====================================================
-- 7. Create Helper Function to Update Product Status
-- =====================================================

-- Function to automatically set product status based on availability_count
CREATE OR REPLACE FUNCTION public.update_product_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.availability_count = 0 THEN
        NEW.status = 'out_of_stock';
    ELSIF NEW.availability_count > 0 AND OLD.availability_count = 0 THEN
        NEW.status = 'available';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-updating status
CREATE TRIGGER auto_update_product_status
    BEFORE UPDATE OF availability_count ON public.products
    FOR EACH ROW
    WHEN (OLD.availability_count IS DISTINCT FROM NEW.availability_count)
    EXECUTE FUNCTION public.update_product_status();

-- =====================================================
-- Migration Complete!
-- =====================================================
--
-- Next Steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify the table in Table Editor
-- 3. Test creating products in your app
--
-- The products table is now ready for:
-- - Creating new product listings
-- - Viewing products by store/category/status
-- - Automatic status updates based on availability
-- - Row-level security to protect user data
--
-- =====================================================
