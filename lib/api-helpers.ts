import { supabase } from './supabase';
import { PaginatedResponse, ProductWithStore, Profile } from './types/database';

/**
 * Get all available products with store information
 */
export const getAllAvailableProducts = async (): Promise<PaginatedResponse<ProductWithStore>> => {
  try {
    // Fetch all available products
    const { data: products, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('⚠️  products table not found. Please run SQL migration.');
        return { data: [], count: 0 };
      }
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
    console.error('Failed to fetch all products:', error);
    return { data: [], count: 0 };
  }
};

/**
 * Get all stores (profiles with role 'USER')
 */
export const getAllStores = async (): Promise<PaginatedResponse<Profile>> => {
  try {
    const { data: stores, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', 'USER')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('⚠️  profiles table not found. Please run SQL migration.');
        return { data: [], count: 0 };
      }
      console.error('Error fetching stores:', error);
      throw new Error(error.message);
    }

    return { data: stores || [], count };
  } catch (error) {
    console.error('Failed to fetch all stores:', error);
    return { data: [], count: 0 };
  }
};

/**
 * Get product by ID with store information
 */
export const getProductById = async (id: string): Promise<ProductWithStore | null> => {
  try {
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
};
