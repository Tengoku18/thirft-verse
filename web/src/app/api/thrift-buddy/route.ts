import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/ai/embeddings';
import {
  generateEmotionalResponse,
  generateNoProductsResponse,
  generateFallbackResponse,
  EmotionType,
} from '@/lib/vertex';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

interface ThriftBuddyRequest {
  message: string;
}

interface ProductResult {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  cover_image: string | null;
  store_id: string;
  similarity: number;
}

interface ThriftBuddyResponse {
  reply: string;
  emotion: EmotionType;
  products: Array<{
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string;
    cover_image: string | null;
    store?: {
      id: string;
      name: string;
      store_username: string;
      currency: string;
    } | null;
  }>;
}

/**
 * POST /api/thrift-buddy
 *
 * Emotionally intelligent AI assistant for product discovery
 *
 * Flow:
 * 1. Detect if message has shopping intent (use simple heuristics)
 * 2. If shopping intent: generate embedding + vector search
 * 3. Send to AI with emotional intelligence prompt
 * 4. Return emotion-aware response + products
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ThriftBuddyRequest = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    // Detect shopping intent (simple keyword detection)
    const shoppingKeywords = [
      'show', 'find', 'looking', 'need', 'want', 'buy', 'get', 'search',
      'affordable', 'cheap', 'price', 'jacket', 'dress', 'shoes', 'bag',
      'clothes', 'furniture', 'electronics', 'vintage', 'thrift', 'product',
      'sell', 'selling', 'recommend', 'suggestion', 'item', 'stuff', 'thing'
    ];

    // Detect greetings (no shopping intent)
    const greetingKeywords = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon'];
    const isGreeting = greetingKeywords.some(keyword =>
      trimmedMessage.toLowerCase().trim() === keyword ||
      trimmedMessage.toLowerCase().startsWith(keyword + ' ') ||
      trimmedMessage.toLowerCase().startsWith(keyword + ',')
    );

    // If not a greeting and message is short (likely a product name), assume shopping intent
    const hasShoppingIntent =
      !isGreeting && (
        shoppingKeywords.some(keyword => trimmedMessage.toLowerCase().includes(keyword)) ||
        (trimmedMessage.split(' ').length <= 3 && trimmedMessage.length >= 3)
      );

    let productsWithStores: Array<ProductResult & { storeName?: string; store?: any }> = [];

    // Only do vector search if shopping intent detected
    if (hasShoppingIntent) {
      try {
        // Generate embedding
        console.log('Generating embedding for:', trimmedMessage);
        const queryEmbedding = await generateEmbedding(trimmedMessage);

        // Vector search
        const supabase = createServiceRoleClient();
        const { data: products, error: searchError } = await supabase.rpc(
          'semantic_product_search',
          {
            query_embedding: queryEmbedding,
            match_threshold: 0.3,
            match_count: 5,
          }
        );

        if (searchError) {
          console.error('Vector search error:', searchError);
        }

        // Fetch store info
        if (products && products.length > 0) {
          const storeIds = [...new Set(products.map((p: any) => p.store_id))];
          const { data: stores } = await supabase
            .from('profiles')
            .select('id, name, store_username, currency')
            .in('id', storeIds);

          const storeMap = new Map(stores?.map((s) => [s.id, s]) || []);

          productsWithStores = products.map((product: any) => ({
            ...product,
            storeName: storeMap.get(product.store_id)?.name || 'Unknown Store',
            store: storeMap.get(product.store_id) || null,
          }));
        }
      } catch (error) {
        console.error('Error in product search:', error);
        // Continue without products
      }
    }

    // Generate emotional AI response
    let emotionalResponse;

    try {
      if (!hasShoppingIntent || productsWithStores.length === 0) {
        // No shopping intent or no products - still use AI for emotional response
        emotionalResponse = await generateEmotionalResponse(
          trimmedMessage,
          productsWithStores.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            category: p.category,
            storeName: p.storeName,
          }))
        );

        // If shopping intent but no products, use special no-products response
        if (hasShoppingIntent && productsWithStores.length === 0) {
          emotionalResponse = generateNoProductsResponse(
            trimmedMessage,
            emotionalResponse.emotion
          );
        }
      } else {
        // Has products - get AI recommendation
        emotionalResponse = await generateEmotionalResponse(
          trimmedMessage,
          productsWithStores.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: p.price,
            category: p.category,
            storeName: p.storeName,
          }))
        );
      }
    } catch (aiError) {
      console.error('AI generation failed:', aiError);
      console.error('Error details:', aiError instanceof Error ? aiError.message : 'Unknown error');

      // Check if API key is missing
      if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY is not set! Add it to your .env file.');
      }

      // Fallback response
      emotionalResponse = generateFallbackResponse(
        productsWithStores.map((p) => ({
          title: p.title,
          price: p.price,
        }))
      );
    }

    const processingTimeMs = Date.now() - startTime;
    console.log(`Request processed in ${processingTimeMs}ms`);

    const response: ThriftBuddyResponse = {
      reply: emotionalResponse.reply,
      emotion: emotionalResponse.emotion,
      products: productsWithStores.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        cover_image: p.cover_image,
        store: p.store,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Thrift Buddy API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
