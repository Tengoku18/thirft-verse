'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';
import { PaginatedResponse, Profile } from '@/types/database';

interface GetProfilesParams {
  limit?: number;
  offset?: number;
  role?: 'ADMIN' | 'USER';
}

interface GetProfileByIdParams {
  id: string;
}

interface GetProfileByStoreUsernameParams {
  storeUsername: string;
}

/**
 * Get all profiles with optional pagination
 */
export async function getProfiles(
  params?: GetProfilesParams
): Promise<PaginatedResponse<Profile>> {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (params?.role) {
      query = query.eq('role', params.role);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      const rangeEnd = params.offset + (params.limit || 10) - 1;
      query = query.range(params.offset, rangeEnd);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching profiles:', error);
      throw new Error(error.message);
    }

    return { data: data || [], count };
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    throw error;
  }
}

/**
 * Get a single profile by ID
 */
export async function getProfileById({
  id,
}: GetProfileByIdParams): Promise<Profile | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch profile by ID:', error);
    return null;
  }
}

/**
 * Get a single profile by store_username
 * This is the main function used for subdomain routing
 */
export async function getProfileByStoreUsername({
  storeUsername,
}: GetProfileByStoreUsernameParams): Promise<Profile | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('store_username', storeUsername)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile by store_username:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        storeUsername,
      });
      return null;
    }

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch profile by store_username:', error);
    return null;
  }
}

/**
 * Get profile ID by store_username
 * @param storeUsername - Store username (subdomain)
 * @returns Profile ID (UUID) or null if not found
 */
export async function getProfileIdByStoreUsername(
  storeUsername: string
): Promise<string | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('store_username', storeUsername)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile ID by store_username:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Failed to fetch profile ID by store_username:', error);
    return null;
  }
}

/**
 * Get profile by ID (convenience function matching web-ref pattern)
 */
export async function getProfile(params: {
  id: string;
}): Promise<Profile | null> {
  return getProfileById(params);
}
