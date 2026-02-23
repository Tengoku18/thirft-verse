import { pipeline, env } from '@xenova/transformers';
import type { FeatureExtractionPipeline } from '@xenova/transformers';

// Configure transformers to use local cache
env.allowLocalModels = false;
env.allowRemoteModels = true;

// Cache the pipeline instance to avoid reloading model
let cachedPipeline: FeatureExtractionPipeline | null = null;

/**
 * Get or initialize the embedding pipeline (singleton pattern)
 * Model: Xenova/all-MiniLM-L6-v2 (384 dimensions, ~23MB)
 */
export async function getEmbeddingPipeline(): Promise<FeatureExtractionPipeline> {
  if (!cachedPipeline) {
    console.log('Loading embedding model...');
    cachedPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    console.log('Embedding model loaded successfully');
  }
  return cachedPipeline;
}

/**
 * Generate embedding vector for a single text
 * @param text - Input text to embed
 * @returns 384-dimensional embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await getEmbeddingPipeline();

    // Generate embedding with mean pooling and normalization
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true
    });

    // Convert tensor data to regular number array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (output as any).data;
    return Array.from(data as ArrayLike<number>);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Create searchable text from product data
 * Combines title, description, and category for richer embeddings
 */
export function createProductSearchText(product: {
  title: string;
  description?: string | null;
  category: string;
}): string {
  const parts = [
    product.title,
    product.description || '',
    product.category
  ].filter(Boolean);

  return parts.join(' ').trim();
}

/**
 * Generate embeddings in batch (for multiple texts)
 * More efficient than calling generateEmbedding multiple times
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const extractor = await getEmbeddingPipeline();
    const output = await extractor(texts, {
      pooling: 'mean',
      normalize: true
    });

    // Convert each embedding to array
    const embeddings: number[][] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = Array.from((output as any).data as ArrayLike<number>);

    for (let i = 0; i < texts.length; i++) {
      const start = i * 384;
      const end = start + 384;
      embeddings.push(data.slice(start, end));
    }

    return embeddings;
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw new Error('Failed to generate batch embeddings');
  }
}
