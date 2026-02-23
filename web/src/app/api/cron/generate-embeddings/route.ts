import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateEmbedding, createProductSearchText } from '@/lib/ai/embeddings';
import { Product } from '@/types/database';

export const maxDuration = 60; // Allow up to 60 seconds for processing
export const dynamic = 'force-dynamic';

/**
 * Cron job endpoint to generate embeddings for products without embeddings
 * Scheduled to run every 5 minutes via Vercel Cron Jobs
 *
 * Security: Verify CRON_SECRET in production
 */
export async function GET() {
  const startTime = Date.now();

  try {
    console.log('🤖 Cron job started: Generate embeddings for products');

    const supabase = createServiceRoleClient();

    // Fetch products without embeddings (limit to 20 per run to avoid timeouts)
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .is('embedding', null)
      .eq('is_active', true)
      .limit(20);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      console.log('✅ No products need embeddings');
      return NextResponse.json({
        success: true,
        message: 'No products need embeddings',
        processed: 0,
        processingTimeMs: Date.now() - startTime
      });
    }

    console.log(`📊 Found ${products.length} products without embeddings`);

    // Process products
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ productId: string; error: string }> = [];

    for (const product of products as Product[]) {
      try {
        // Create searchable text
        const searchText = createProductSearchText(product);

        // Generate embedding
        const embedding = await generateEmbedding(searchText);

        // Update database
        const { error: updateError } = await supabase
          .from('products')
          .update({
            embedding,
            embedding_model: 'Xenova/all-MiniLM-L6-v2',
            embedding_generated_at: new Date().toISOString()
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Failed to update product ${product.id}:`, updateError);
          errorCount++;
          errors.push({
            productId: product.id,
            error: updateError.message
          });
        } else {
          console.log(`✅ Generated embedding for: ${product.title}`);
          successCount++;
        }

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing product ${product.id}:`, error);
        errorCount++;
        errors.push({
          productId: product.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const processingTimeMs = Date.now() - startTime;

    console.log('📊 Cron job completed:', {
      success: successCount,
      errors: errorCount,
      total: products.length,
      timeMs: processingTimeMs
    });

    return NextResponse.json({
      success: true,
      processed: successCount,
      errors: errorCount,
      total: products.length,
      processingTimeMs,
      errorDetails: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
