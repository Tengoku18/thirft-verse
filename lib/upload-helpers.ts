import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image to Supabase Storage bucket
 * Supports React Native URIs (file://, content://, etc.)
 */
export async function uploadImageToStorage(
  imageUri: string,
  bucket: string = 'products',
  folder: string = 'products'
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);

    // Extract file extension from URI
    let fileExt = 'jpg'; // default
    const uriParts = imageUri.split('.');
    if (uriParts.length > 1) {
      fileExt = uriParts[uriParts.length - 1].split('?')[0]; // Remove query params
    }

    const fileName = `${random}-${timestamp}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // For React Native, we need to convert the URI to a Blob
    // Fetch the image as a blob from the local URI
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Check file size (max 5MB)
    if (blob.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: `image/${fileExt}`,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);

      if (uploadError.message?.includes('Bucket not found')) {
        return {
          success: false,
          error: `Storage bucket "${bucket}" not configured. Please check Supabase Dashboard.`,
        };
      }

      return {
        success: false,
        error: uploadError.message || 'Failed to upload image',
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

/**
 * Uploads multiple images to Supabase Storage
 * Returns array of results for each image
 */
export async function uploadMultipleImages(
  imageUris: string[],
  bucket: string = 'products',
  folder: string = 'products'
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const uri of imageUris) {
    const result = await uploadImageToStorage(uri, bucket, folder);
    results.push(result);
  }

  return results;
}

/**
 * Helper to extract successful URLs from upload results
 */
export function getSuccessfulUrls(results: UploadResult[]): string[] {
  return results
    .filter(result => result.success && result.url)
    .map(result => result.url!);
}
