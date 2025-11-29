import { supabase } from "./supabase";
import { PaginatedResponse, Product, ProductStatus } from "./types/database";

/**
 * Check if email already exists
 * Note: Client-side email checking is not possible with Supabase auth.
 * Supabase auth handles email uniqueness automatically during signUp.
 * We return false here and let Supabase handle duplicate email errors.
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  // Email uniqueness is enforced by Supabase auth during signUp
  // If a duplicate email is used, signUp will return an error
  return false;
};

/**
 * Check if store username already exists in the database
 */
export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  try {
    const lowercaseUsername = username.toLowerCase();

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("store_username", lowercaseUsername)
      .maybeSingle();

    if (error) {
      // Table doesn't exist
      if (error.code === "PGRST205") {
        console.warn("⚠️  profiles table not found - skipping username check.");
        return false;
      }
      // Invalid API key
      if (error.message?.includes("Invalid API key")) {
        console.warn("⚠️  Supabase API key invalid - skipping username check.");
        return false;
      }
      // No rows found is not an error for our purposes
      if (error.code !== "PGRST116") {
        console.warn("⚠️  Error checking username:", error.message);
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
  address?: string;
}

export const createUserProfile = async (data: CreateProfileData) => {
  try {
    const { error } = await supabase.from("profiles").insert({
      id: data.userId,
      name: data.name,
      store_username: data.store_username.toLowerCase(),
      bio: data.bio || "",
      profile_image: data.profile_image || null,
      currency: data.currency || "NPR",
      address: data.address || "",
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
 * Verify if user profile exists in database
 * Call this before operations that require profile (like creating products)
 */
export const verifyProfileExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking profile:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in verifyProfileExists:", error);
    return false;
  }
};

/**
 * Automatically create missing profile for users who signed up before profile creation was fixed
 * Uses auth metadata to populate profile data
 */
export const createMissingProfile = async () => {
  try {
    // Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ No authenticated user found:", userError);
      return {
        success: false,
        error: {
          message: "You must be logged in. Please sign in again.",
        },
      };
    }

    // Check if profile already exists
    const profileExists = await verifyProfileExists(user.id);
    if (profileExists) {
      console.log("✅ Profile already exists for user:", user.id);
      return { success: true, alreadyExists: true };
    }

    // Extract data from user metadata
    const metadata = user.user_metadata || {};
    const name = metadata.name || user.email?.split("@")[0] || "User";
    const username = metadata.username || user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`;
    const profileImage = metadata.profile_image || null;
    const address = metadata.address || "";

    console.log("🔄 Creating missing profile for user:", user.id);

    // Create the profile
    const result = await createUserProfile({
      userId: user.id,
      name,
      store_username: username,
      bio: "",
      profile_image: profileImage,
      currency: "NPR",
      address,
    });

    if (!result.success) {
      console.error("❌ Failed to create missing profile:", result.error);
      return {
        success: false,
        error: {
          message: "Failed to create your profile. Please contact support.",
        },
      };
    }

    console.log("✅ Successfully created missing profile for user:", user.id);
    return { success: true, created: true };
  } catch (error) {
    console.error("💥 Error in createMissingProfile:", error);
    return {
      success: false,
      error: {
        message: "An unexpected error occurred while creating your profile.",
      },
    };
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
  address?: string;
  profile_image?: string;
}

export const updateUserProfile = async (data: UpdateProfileData) => {
  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.address !== undefined) updateData.address = data.address;
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

/**
 * Get orders where user is the buyer (purchases)
 */
export const getOrdersByBuyer = async (buyerEmail: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        seller:profiles!orders_seller_id_fkey(id, name, store_username),
        product:products!orders_product_id_fkey(id, title, cover_image, price)
      `)
      .eq("buyer_email", buyerEmail)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "PGRST205") {
        console.warn("⚠️  orders table not found. Please run SQL migration.");
        return { success: false, data: [], tableNotFound: true };
      }
      console.error("❌ Error fetching buyer orders:", error);
      return { success: false, data: [], error };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("💥 Error in getOrdersByBuyer:", error);
    return { success: false, data: [], error };
  }
};

/**
 * Get orders where user is the seller (sales)
 */
export const getOrdersBySeller = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        product:products!orders_product_id_fkey(id, title, cover_image, price)
      `)
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "PGRST205") {
        console.warn("⚠️  orders table not found. Please run SQL migration.");
        return { success: false, data: [], tableNotFound: true };
      }
      console.error("❌ Error fetching seller orders:", error);
      return { success: false, data: [], error };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("💥 Error in getOrdersBySeller:", error);
    return { success: false, data: [], error };
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded') => {
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      console.error("❌ Error updating order status:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("💥 Error in updateOrderStatus:", error);
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

      // Foreign key constraint violation (profile doesn't exist)
      if (error.code === "23503" && error.message?.includes("products_store_id_fkey")) {
        console.error("❌ Foreign Key Error: Profile doesn't exist");
        console.error("This means the user's profile was not created during signup");
        console.error("store_id:", data.store_id);
        console.log("🔄 Attempting automatic profile recovery...");

        // Try to automatically create the missing profile
        const recoveryResult = await createMissingProfile();

        if (recoveryResult.success) {
          console.log("✅ Profile recovered successfully! Retrying product creation...");

          // Retry the product creation now that profile exists
          const { data: retryProduct, error: retryError } = await supabase
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

          if (retryError) {
            console.error("❌ Retry failed after profile recovery:", retryError);
            return {
              success: false,
              error: {
                message: "Profile was recovered but product creation still failed. Please try again.",
              },
            };
          }

          return { success: true, data: retryProduct, profileRecovered: true };
        } else {
          // Profile recovery failed
          return {
            success: false,
            error: {
              ...error,
              message:
                "Your profile is missing and could not be automatically recovered. Please sign out and sign up again, or contact support.",
            },
            profileMissing: true,
          };
        }
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
