import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { supabase } from "./supabase";

export interface UploadResult {
  success: boolean;
  url?: string;
  publicUrl?: string;
  path?: string;
  key?: string;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImageToStorage(
  imageUri: string,
  bucket: string = "products",
  folder: string = "products"
): Promise<UploadResult> {
  try {
    const file = new File(imageUri);
    if (!file.exists || !file.size) {
      const exists = await file.exists;
      if (!exists) {
        return { success: false, error: "File does not exist at URI" };
      }
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "File size must be less than 5MB",
      };
    }
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    let fileExt = "jpg";
    const uriParts = imageUri.split(".");
    if (uriParts.length > 1) {
      fileExt = uriParts[uriParts.length - 1].split("?")[0].toLowerCase();
    }

    // Convert HEIC/HEIF to JPG for browser compatibility
    let finalUri = imageUri;
    if (fileExt === "heic" || fileExt === "heif") {
      const manipulated = await ImageManipulator.manipulate(imageUri)
        .renderAsync();
      const result = await manipulated.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
      });
      finalUri = result.uri;
      fileExt = "jpg";
    }

    const mimeType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
    const fileName = `${random}-${timestamp}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const finalFile = new File(finalUri);
    const base64Data = await finalFile.base64();
    const arrayBuffer = decode(base64Data);
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType,
      });

    if (uploadError) {
      if (uploadError.message?.includes("Bucket not found")) {
        return {
          success: false,
          error: `Storage bucket "${bucket}" not configured. Please check Supabase Dashboard.`,
        };
      }

      return {
        success: false,
        error: uploadError.message || "Failed to upload image",
      };
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      publicUrl: publicUrl,
      path: data?.path || filePath,
      key: data?.path || filePath,
    };
  } catch (error) {
    console.error("Upload exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

/**
 * Uploads multiple images to Supabase Storage
 * Returns array of results for each image
 */
export async function uploadMultipleImages(
  imageUris: string[],
  bucket: string = "products",
  folder: string = "products"
): Promise<UploadResult[]> {
  if (!imageUris || imageUris.length === 0) {
    return [];
  }

  const results: UploadResult[] = [];

  for (const imageUri of imageUris) {
    const result = await uploadImageToStorage(imageUri, bucket, folder);
    results.push(result);

    if (!result.success) {
      console.error("Upload failed:", result.error);
    }
  }

  return results;
}

/**
 * Helper to extract successful URLs from upload results
 */
export function getSuccessfulUrls(results: UploadResult[]): string[] {
  return results
    .filter((result) => result.success && result.url)
    .map((result) => result.url!);
}
