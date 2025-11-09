import { supabase } from "./supabase";
import { PaginatedResponse, Product, ProductStatus } from "./types/database";

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
export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("store_username", username.toLowerCase())
      .maybeSingle();

    // If API key is invalid, skip check and allow signup
    if (error) {
      // Table doesn't exist yet - skip check
      if (error.code === "PGRST205") {
        console.warn(
          "⚠️  profiles table not found - skipping username check. Please run SQL migration."
        );
        return false; // Allow signup to continue
      }
      if (error.message?.includes("Invalid API key")) {
        console.warn(
          "⚠️  Supabase API key invalid - skipping username check. Please update credentials in .env"
        );
        return false; // Allow signup to continue
      }
      if (error.code !== "PGRST116") {
        console.warn(
          "⚠️  Error checking username - skipping check:",
          error.message
        );
        return false;
      }
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkUsernameExists:", error);
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
    const { error } = await supabase.from("profiles").insert({
      id: data.userId,
      name: data.name,
      store_username: data.store_username.toLowerCase(),
      bio: data.bio || null,
      profile_image: data.profile_image || null,
      currency: data.currency || "NPR",
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("💥 Error in createUserProfile:", error);
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
      .from("products")
      .select("*", { count: "exact" })
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
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
      if (error.code === "PGRST205") {
        console.warn("⚠️  products table not found. Please run SQL migration.");
        return { data: [], count: 0 };
      }

      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return { data: data || [], count };
  } catch (error) {
    console.error("Failed to fetch products:", error);
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
  return getProductsByStoreId({ storeId, limit, offset, status: "available" });
};

/**
 * Get products count by store ID
 */
export const getProductsCountByStore = async (
  storeId: string
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId);

    if (error) {
      if (error.code === "PGRST205") {
        console.warn("⚠️  products table not found. Please run SQL migration.");
        return 0;
      }
      console.error("Error fetching products count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Failed to fetch products count:", error);
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
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profile_image !== undefined)
      updateData.profile_image = data.profile_image;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", data.userId);

    if (error) {
      // Table doesn't exist - warn but don't fail
      if (error.code === "PGRST205") {
        console.warn(
          "⚠️  profiles table not found - profile NOT updated. Please run SQL migration."
        );
        return { success: false, error, tableNotFound: true };
      }

      console.error("❌ Error updating profile:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("💥 Error in updateUserProfile:", error);
    return { success: false, error };
  }
};

/**
 * Create a new product
 */
interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  availability_count: number;
  cover_image: string;
  other_images: string[];
  store_id: string;
}

/**
 * Get user profile by user ID
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // Table doesn't exist
      if (error.code === "PGRST205") {
        console.warn("⚠️  profiles table not found. Please run SQL migration.");
        return { success: false, error, tableNotFound: true };
      }

      // No profile found
      if (error.code === "PGRST116") {
        console.warn("⚠️  No profile found for user:", userId);
        return { success: false, error, notFound: true };
      }

      console.error("❌ Error fetching profile:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("💥 Error in getUserProfile:", error);
    return { success: false, error };
  }
};

/**
 * Get current user auth data from Supabase Auth
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("❌ Error fetching current user:", error);
      return { success: false, error };
    }

    if (!user) {
      console.warn("⚠️  No authenticated user found");
      return { success: false, error: { message: "No authenticated user" } };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("💥 Error in getCurrentUser:", error);
    return { success: false, error };
  }
};

/**
 * Get current session from Supabase Auth
 */
export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Error fetching current session:", error);
      return { success: false, error };
    }

    if (!session) {
      console.warn("⚠️  No active session found");
      return { success: false, error: { message: "No active session" } };
    }

    return { success: true, data: session };
  } catch (error) {
    console.error("💥 Error in getCurrentSession:", error);
    return { success: false, error };
  }
};

export const createProduct = async (data: CreateProductData) => {
  try {
    // IMPORTANT: Verify the user session before creating product
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("❌ No active session found:", sessionError);
      return {
        success: false,
        error: {
          message:
            "You must be logged in to create a product. Please sign in again.",
        },
      };
    }

    // Verify that the store_id matches the authenticated user
    if (session.user.id !== data.store_id) {
      console.error("❌ User ID mismatch:", {
        sessionUserId: session.user.id,
        requestedStoreId: data.store_id,
      });
      return {
        success: false,
        error: { message: "Cannot create product for another user." },
      };
    }

    // Validate required images
    if (!data.cover_image) {
      console.error("❌ No cover image provided");
      return {
        success: false,
        error: { message: "Cover image is required" },
      };
    }

    if (!data.other_images || data.other_images.length === 0) {
      console.error("❌ No additional images provided");
      return {
        success: false,
        error: { message: "At least one additional image is required" },
      };
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        availability_count: data.availability_count,
        cover_image: data.cover_image,
        other_images: data.other_images,
        store_id: data.store_id,
        status: "available",
      })
      .select()
      .single();

    if (error) {
      // Table doesn't exist
      if (error.code === "PGRST205") {
        console.warn("⚠️  products table not found. Please run SQL migration.");
        return { success: false, error, tableNotFound: true };
      }

      // RLS policy violation
      if (error.code === "42501") {
        console.error("❌ RLS Policy Error:", error);
        console.error("This usually means:");
        console.error(
          "1. The products table RLS policies are not set up correctly"
        );
        console.error(
          "2. Your session token is not being sent with the request"
        );
        console.error("3. The auth.uid() does not match the store_id");
        return {
          success: false,
          error: {
            ...error,
            message:
              "Permission denied. Please check Supabase RLS policies and try logging out and back in.",
          },
          rlsError: true,
        };
      }

      console.error("❌ Error creating product:", error);
      return { success: false, error };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("💥 Error in createProduct:", error);
    return { success: false, error };
  }
};
