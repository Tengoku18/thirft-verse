/**
 * One-time script to generate embeddings for all existing products
 *
 * Run with: npm run generate-embeddings
 */

// Load environment variables from .env file
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../../.env') });

import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateEmbedding, createProductSearchText } from '@/lib/ai/embeddings';
import { Product } from '@/types/database';

async function main() {
  console.log('🚀 Starting embedding generation for products...\n');

  const supabase = createServiceRoleClient();

  // Fetch all products without embeddings
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .is('embedding', null)
    .eq('is_active', true);

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  if (!products || products.length === 0) {
    console.log('✅ All products already have embeddings!');
    return;
  }

  console.log(`📊 Found ${products.length} products without embeddings\n`);

  // Process products one by one (batch processing can be added later)
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i] as Product;

    try {
      console.log(`[${i + 1}/${products.length}] Processing: ${product.title}`);

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
        console.error(`  ❌ Failed to update: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }

      // Small delay to avoid overwhelming the server
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

    } catch (error) {
      console.error(`  ❌ Error processing product:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📈 Total: ${products.length}`);
  console.log('\n🎉 Done!');
}

// Run the script
main().catch(console.error);
