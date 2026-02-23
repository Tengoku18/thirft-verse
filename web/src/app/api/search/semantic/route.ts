import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/ai/embeddings';
import { ProductWithStore } from '@/types/database';
import { SemanticSearchResponse } from '@/types/search';

// Vercel serverless function configuration
// Increase timeout for AI model loading (first request can take 5-10s)
export const maxDuration = 30; // 30 seconds (requires Vercel Pro for >10s)
export const dynamic = 'force-dynamic'; // Don't cache API responses

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = await request.json();
    const { query, limit = 6, minSimilarity = 0.3 } = body;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    console.log('Generating embedding for query:', query);
    const queryEmbedding = await generateEmbedding(query);

    // Search Supabase using the semantic_product_search function
    const supabase = createServiceRoleClient();
    const { data: products, error } = await supabase.rpc('semantic_product_search', {
      query_embedding: queryEmbedding,
      match_threshold: minSimilarity,
      match_count: limit
    });

    if (error) {
      console.error('Supabase search error:', error);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // If no results, return empty array
    if (!products || products.length === 0) {
      const processingTimeMs = Date.now() - startTime;
      return NextResponse.json({
        results: [],
        query,
        count: 0,
        processingTimeMs
      });
    }

    // Fetch store information for each product
    const storeIds = [...new Set(products.map((p: any) => p.store_id))];
    const { data: stores, error: storesError } = await supabase
      .from('profiles')
      .select('id, name, store_username, currency')
      .in('id', storeIds);

    if (storesError) {
      console.error('Error fetching stores:', storesError);
    }

    // Create store map for quick lookup
    const storeMap = new Map(stores?.map(s => [s.id, s]) || []);

    // Combine products with store data and similarity scores
    const results = products.map((product: any) => ({
      product: {
        ...product,
        store: storeMap.get(product.store_id) || null
      } as ProductWithStore,
      similarity: product.similarity
    }));

    const processingTimeMs = Date.now() - startTime;

    const response: SemanticSearchResponse = {
      results,
      query,
      count: results.length,
      processingTimeMs
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Semantic search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
