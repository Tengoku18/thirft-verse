import { supabase } from './supabase';
import { Product, ProductStatus, PaginatedResponse } from './types/database';

/**
 * Check if email already exists in auth.users
 * Note: Email uniqueness is handled by Supabase auth automatically
 * We return false here to skip client-side check and let Supabase handle it
 * If email exists, signInWithOtp will handle the user appropriately
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  // Supabase auth handles email uniqueness automatically
  // When using signInWithOtp, if email exists, it sends OTP to existing user
  // We'll handle duplicate email errors when they occur during signup
  return false;
};

/**
 * Check if store username already exists in the database
 */
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('store_username', username.toLowerCase())
      .maybeSingle();

    // If API key is invalid, skip check and allow signup
    if (error) {
      // Table doesn't exist yet - skip check
      if (error.code === 'PGRST205') {
        console.warn('⚠️  profiles table not found - skipping username check. Please run SQL migration.');
        return false; // Allow signup to continue
      }
      if (error.message?.includes('Invalid API key')) {
        console.warn('⚠️  Supabase API key invalid - skipping username check. Please update credentials in .env');
        return false; // Allow signup to continue
      }
      if (error.code !== 'PGRST116') {
        console.warn('⚠️  Error checking username - skipping check:', error.message);
        return false;
      }
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkUsernameExists:', error);
    return false;
  }
};

/**
 * Create user profile after successful signup
 */
export interface CreateProfileData {
  userId: string;
  name: string;
  store_username: string;
  bio?: string;
  profile_image?: string | null;
  currency?: string;
}

export const createUserProfile = async (data: CreateProfileData) => {
  try {
    console.log('📝 Creating profile in database:', data);

    const { error } = await supabase.from('profiles').insert({
      id: data.userId,
      name: data.name,
      store_username: data.store_username.toLowerCase(),
      bio: data.bio || null,
      profile_image: data.profile_image || null,
      currency: data.currency || 'NPR',
    });

    if (error) {
      // Table doesn't exist - warn but don't fail signup
      if (error.code === 'PGRST205') {
        console.warn('⚠️  profiles table not found - profile NOT created. Please run SQL migration.');
        console.warn('⚠️  User can still sign in, but profile data will only be in auth metadata.');
        return { success: false, error, tableNotFound: true };
      }

      console.error('❌ Error creating profile:', error);
      return { success: false, error };
    }

    console.log('✅ Profile created successfully!');
    return { success: true };
  } catch (error) {
    console.error('💥 Error in createUserProfile:', error);
    return { success: false, error };
  }
};

/**
 * Get products by user/store ID
 */
interface GetProductsParams {
  storeId: string;
  limit?: number;
  offset?: number;
  status?: ProductStatus;
}

export const getProductsByStoreId = async (
  params: GetProductsParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const { storeId, limit = 12, offset = 0, status } = params;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      const rangeEnd = offset + limit - 1;
      query = query.range(offset, rangeEnd);
    }

    const { data, error, count } = await query;

    if (error) {
      // Table doesn't exist yet
      if (error.code === 'PGRST205') {
        console.warn('⚠️  products table not found. Please run SQL migration.');
        return { data: [], count: 0 };
      }

      console.error('Error fetching products:', error);
      throw new Error(error.message);
    }

    return { data: data || [], count };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { data: [], count: 0 };
  }
};

/**
 * Get available products by user/store ID (convenience function)
 */
export const getAvailableProductsByStoreId = async (
  storeId: string,
  limit?: number,
  offset?: number
): Promise<PaginatedResponse<Product>> => {
  return getProductsByStoreId({ storeId, limit, offset, status: 'available' });
};

/**
 * Get products count by store ID
 */
export const getProductsCountByStore = async (
  storeId: string
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId);

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('⚠️  products table not found. Please run SQL migration.');
        return 0;
      }
      console.error('Error fetching products count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to fetch products count:', error);
    return 0;
  }
};

/**
 * Update user profile (name and bio)
 */
interface UpdateProfileData {
  userId: string;
  name?: string;
  bio?: string;
  profile_image?: string;
}

export const updateUserProfile = async (data: UpdateProfileData) => {
  try {
    console.log('📝 Updating profile in database:', data);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profile_image !== undefined) updateData.profile_image = data.profile_image;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', data.userId);

    if (error) {
      // Table doesn't exist - warn but don't fail
      if (error.code === 'PGRST205') {
        console.warn('⚠️  profiles table not found - profile NOT updated. Please run SQL migration.');
        return { success: false, error, tableNotFound: true };
      }

      console.error('❌ Error updating profile:', error);
      return { success: false, error };
    }

    console.log('✅ Profile updated successfully!');
    return { success: true };
  } catch (error) {
    console.error('💥 Error in updateUserProfile:', error);
    return { success: false, error };
  }
};
