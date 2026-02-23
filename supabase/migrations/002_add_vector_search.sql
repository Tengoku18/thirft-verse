-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create product_status enum type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
    CREATE TYPE product_status AS ENUM ('available', 'out_of_stock');
  END IF;
END $$;

-- Add embedding column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS embedding vector(384),
ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'Xenova/all-MiniLM-L6-v2',
ADD COLUMN IF NOT EXISTS embedding_generated_at TIMESTAMPTZ;

-- Create vector similarity index (IVFFlat for approximate nearest neighbor)
-- Lists = 100 is good for datasets with 10K-1M products
CREATE INDEX IF NOT EXISTS products_embedding_idx
ON products
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Drop existing function if it exists (to handle return type changes)
DROP FUNCTION IF EXISTS semantic_product_search(vector, float, int);
DROP FUNCTION IF EXISTS semantic_product_search(vector, double precision, integer);

-- Create function for semantic product search
-- This function performs cosine similarity search and returns matching products
CREATE OR REPLACE FUNCTION semantic_product_search(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  store_id uuid,
  title text,
  description text,
  category text,
  price numeric,
  cover_image text,
  other_images text[],
  availability_count integer,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.store_id,
    p.title,
    p.description,
    p.category,
    p.price,
    p.cover_image,
    p.other_images,
    p.availability_count,
    p.status,
    p.created_at,
    p.updated_at,
    1 - (p.embedding <=> query_embedding) as similarity
  FROM products p
  WHERE p.embedding IS NOT NULL
    AND p.status = 'available'
    AND p.is_active = true
    AND 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
