import { ProductWithStore } from '@/types/database';

export type EmotionType = 'happy' | 'sad' | 'neutral' | 'excited' | 'frustrated' | 'confused' | 'grateful';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: ProductWithStore[];
  timestamp: Date;
  error?: boolean;
  emotion?: EmotionType;
}

export interface SearchResult {
  product: ProductWithStore;
  similarity: number;
}

export interface SemanticSearchRequest {
  query: string;
  limit?: number;
  minSimilarity?: number;
}

export interface SemanticSearchResponse {
  results: SearchResult[];
  query: string;
  count: number;
  processingTimeMs: number;
}
