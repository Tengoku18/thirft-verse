'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';
import {
  PaginatedResponse,
  ProductStatus,
  ProductWithStore,
} from '@/types/database';

interface GetProductsParams {
  limit?: number;
  offset?: number;
  status?: ProductStatus;
  storeId?: string;
}

interface GetProductsByStoreUsernameParams {
  storeUsername: string;
  limit?: number;
  offset?: number;
  status?: ProductStatus;
}

interface GetProductByIdParams {
  id: string;
}

/**
 * Get all products with optional filters and pagination
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<PaginatedResponse<ProductWithStore>> {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by store ID
    if (params?.storeId) {
      query = query.eq('store_id', params.storeId);
    }

    // Filter by status
    if (params?.status) {
      query = query.eq('status', params.status);
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      const rangeEnd = params.offset + (params.limit || 10) - 1;
      query = query.range(params.offset, rangeEnd);
    }

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.message);
    }

    if (!products || products.length === 0) {
      return { data: [], count };
    }

    // Get unique store IDs
    const storeIds = [...new Set(products.map((p) => p.store_id))];

    // Fetch all stores
    const { data: stores, error: storesError } = await supabase
      .from('profiles')
      .select('id, name, store_username, currency')
      .in('id', storeIds);

    if (storesError) {
      console.error('Error fetching stores:', storesError);
      throw new Error(storesError.message);
    }

    // Create a map for quick lookup
    const storeMap = new Map(stores?.map((s) => [s.id, s]) || []);

    // Combine products with their stores
    const productsWithStores: ProductWithStore[] = products.map((product) => ({
      ...product,
      store: storeMap.get(product.store_id) || null,
    }));

    return { data: productsWithStores, count };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

/**
 * Get products by store's username
 */
export async function getProductsByStoreUsername(
  params: GetProductsByStoreUsernameParams
): Promise<PaginatedResponse<ProductWithStore>> {
  try {
    const supabase = createServiceRoleClient();

    // First, get the store by store_username
    const { data: store, error: storeError } = await supabase
      .from('profiles')
      .select('id, name, store_username, currency')
      .eq('store_username', params.storeUsername)
      .maybeSingle();

    if (storeError || !store) {
      console.error('Error fetching store by username:', storeError);
      return { data: [], count: 0 };
    }

    // Then fetch products for this store
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('store_id', store.id)
      .order('created_at', { ascending: false });

    // Filter by status
    if (params.status) {
      query = query.eq('status', params.status);
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      const rangeEnd = params.offset + (params.limit || 10) - 1;
      query = query.range(params.offset, rangeEnd);
    }

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products by store username:', error);
      throw new Error(error.message);
    }

    // Combine products with store data
    const productsWithStore: ProductWithStore[] = (products || []).map(
      (product) => ({
        ...product,
        store,
      })
    );

    return { data: productsWithStore, count };
  } catch (error) {
    console.error('Failed to fetch products by store username:', error);
    throw error;
  }
}

/**
 * Get a single product by ID with store information
 */
export async function getProductById({
  id,
}: GetProductByIdParams): Promise<ProductWithStore | null> {
  try {
    const supabase = createServiceRoleClient();

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (productError || !product) {
      console.error('Error fetching product by ID:', productError);
      return null;
    }

    // Fetch store profile
    const { data: store, error: storeError } = await supabase
      .from('profiles')
      .select('id, name, store_username, currency')
      .eq('id', product.store_id)
      .maybeSingle();

    if (storeError || !store) {
      console.error('Error fetching store profile:', storeError);
      return null;
    }

    // Combine product and store data
    return {
      ...product,
      store,
    };
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    return null;
  }
}

/**
 * Get available products (convenience function)
 */
export async function getAvailableProducts(
  params?: Omit<GetProductsParams, 'status'>
): Promise<PaginatedResponse<ProductWithStore>> {
  return getProducts({ ...params, status: 'available' });
}

/**
 * Get products count by store ID
 */
export async function getProductsCountByStore(
  storeId: string
): Promise<number> {
  try {
    const supabase = createServiceRoleClient();

    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    if (error) {
      console.error('Error fetching products count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to fetch products count:', error);
    return 0;
  }
}

/**
 * Get all products by store ID
 * @param storeId - The store's profile ID
 * @param options - Optional filters and pagination
 * @returns Products with store information
 */
export async function getProductsByStoreId(
  storeId: string,
  options?: {
    limit?: number;
    offset?: number;
    status?: ProductStatus;
  }
): Promise<PaginatedResponse<ProductWithStore>> {
  try {
    const supabase = createServiceRoleClient();

    // Fetch store profile first
    const { data: store, error: storeError } = await supabase
      .from('profiles')
      .select('id, name, store_username, currency')
      .eq('id', storeId)
      .maybeSingle();

    if (storeError || !store) {
      console.error('Error fetching store profile:', storeError);
      return { data: [], count: 0 };
    }

    // Fetch products
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (options?.status) {
      query = query.eq('status', options.status);
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      const rangeEnd = options.offset + (options.limit || 10) - 1;
      query = query.range(options.offset, rangeEnd);
    }

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products by store ID:', error);
      throw new Error(error.message);
    }

    // Combine products with store data
    const productsWithStore: ProductWithStore[] = (products || []).map(
      (product) => ({
        ...product,
        store,
      })
    );

    return { data: productsWithStore, count };
  } catch (error) {
    console.error('Failed to fetch products by store ID:', error);
    throw error;
  }
}

/**
 * Alias to match web-ref naming convention (getProductsByCreatorId)
 */
export const getProductsByCreatorId = getProductsByStoreId;

/**
 * Decrement product availability count after successful purchase
 * Also updates status to 'out_of_stock' if availability reaches 0
 */
export async function decrementProductAvailability(
  productId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    // First get the current product to check availability
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('availability_count, status')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      console.error('Error fetching product for inventory update:', fetchError);
      return {
        success: false,
        error: 'Product not found',
      };
    }

    // Calculate new availability
    const newAvailability = Math.max(0, product.availability_count - quantity);

    // Determine new status
    const newStatus = newAvailability === 0 ? 'out_of_stock' : product.status;

    // Update the product
    const { error: updateError } = await supabase
      .from('products')
      .update({
        availability_count: newAvailability,
        status: newStatus,
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product availability:', updateError);
      return {
        success: false,
        error: updateError.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to decrement product availability:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update inventory',
    };
  }
}
