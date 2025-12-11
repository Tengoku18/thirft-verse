import { readAsStringAsync } from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "./supabase";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;

export const getStorageUrl = (bucket: string, path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
};

/**
 * Get product image URL
 * @param imagePath - Path from the products table (e.g., 'products/xyz.jpeg')
 * @returns Full public URL
 */
export const getProductImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  // If it's already a full URL (http/https), return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a local file URI (file://, content://, etc.), return it as-is
  // This handles images from ImagePicker before upload
  if (imagePath.includes("://") && !imagePath.startsWith("http")) {
    return imagePath;
  }

  // If path includes bucket name, extract it
  if (imagePath.includes("products/")) {
    const pathWithoutBucket = imagePath.split("products/").pop() || "";
    return getStorageUrl("products", `products/${pathWithoutBucket}`);
  }

  // Otherwise assume it's in products bucket
  return getStorageUrl("products", imagePath);
};

/**
 * Get profile image URL
 * @param imagePath - Path from the profiles table
 * @returns Full public URL
 */
export const getProfileImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return "";

  // If it's already a full URL (http/https), return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a local file URI (file://, content://, etc.), return it as-is
  // This handles images from ImagePicker before upload
  if (imagePath.includes("://") && !imagePath.startsWith("http")) {
    return imagePath;
  }

  return getStorageUrl("profiles", imagePath);
};

export const uploadImage = async (
  bucket: string,
  path: string,
  file: File | Blob | ArrayBuffer,
  contentType: string = "image/jpeg"
): Promise<{ success: boolean; url?: string; error?: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false, // Set to true to overwrite existing files
      });

    if (error) {
      console.error("❌ Upload error:", error);
      return { success: false, error };
    }

    const url = getStorageUrl(bucket, path);

    return { success: true, url };
  } catch (error) {
    console.error("💥 Upload failed:", error);
    return { success: false, error };
  }
};

export const deleteImage = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("❌ Delete error:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    console.error("💥 Delete failed:", error);
    return { success: false, error };
  }
};

export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  return `${randomStr}-${timestamp}.${extension}`;
};

/**
 * Get image dimensions from URL
 * Useful for React Native Image component
 */
export const getImageDimensions = (
  uri: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (!uri) {
      reject(new Error("No URI provided"));
      return;
    }

    const Image = require("react-native").Image;
    Image.getSize(
      uri,
      (width: number, height: number) => {
        resolve({ width, height });
      },
      (error: any) => {
        reject(error);
      }
    );
  });
};

export const uploadProfileImage = async (
  userId: string,
  localUri: string
): Promise<{ success: boolean; url?: string; error?: any }> => {
  try {
    // Extract extension properly (handle query params in URI)
    const uriWithoutParams = localUri.split("?")[0];
    const extension = uriWithoutParams.split(".").pop()?.toLowerCase() || "jpg";

    // Determine MIME type
    const mimeType =
      extension === "png"
        ? "image/png"
        : extension === "gif"
          ? "image/gif"
          : extension === "webp"
            ? "image/webp"
            : "image/jpeg";

    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${extension}`;
    const filePath = `profiles/${fileName}`;

    // Read file as base64 using expo-file-system (reliable in React Native)
    const base64 = await readAsStringAsync(localUri, {
      encoding: "base64",
    });

    // Upload to Supabase Storage using base64-arraybuffer decode
    const { error } = await supabase.storage
      .from("profiles")
      .upload(filePath, decode(base64), {
        cacheControl: "3600",
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error("❌ Profile image upload error:", error);
      return { success: false, error };
    }

    // Get the full public URL (matching web logic)
    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("💥 Profile image upload failed:", error);
    return { success: false, error };
  }
};

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  PRODUCTS: "products",
  PROFILES: "profiles",
  AVATARS: "avatars",
} as const;
