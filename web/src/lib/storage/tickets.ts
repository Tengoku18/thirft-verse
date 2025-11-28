import { createClient } from '@/lib/supabase/client';

const TICKETS_BUCKET = 'tickets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  error?: string;
}

export interface UploadAttachmentsResult {
  urls: string[];
  errors: string[];
  allSuccessful: boolean;
  partialSuccess: boolean;
}

/**
 * Generate a unique filename for ticket attachments
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${randomStr}-${timestamp}.${extension}`;
}

/**
 * Get user-friendly error message from Supabase error
 */
function getUploadErrorMessage(error: Error | { message?: string }): string {
  const message = error instanceof Error ? error.message : error.message || '';

  if (message.includes('Bucket not found')) {
    return 'Storage not configured. Please contact support.';
  }
  if (message.includes('Permission denied') || message.includes('not authorized')) {
    return 'Upload permission denied. Please try again later.';
  }
  if (message.includes('Payload too large')) {
    return 'File is too large to upload.';
  }
  if (message.includes('Invalid JWT') || message.includes('JWT')) {
    return 'Session expired. Please refresh the page and try again.';
  }
  if (message.includes('Network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  return message || 'Failed to upload file. Please try again.';
}

/**
 * Upload a single image to the tickets bucket
 */
export async function uploadTicketAttachment(file: File): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        fileName: file.name,
        error: `"${file.name}" is too large (max 5MB)`,
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        fileName: file.name,
        error: `"${file.name}" is not a valid image file`,
      };
    }

    const supabase = createClient();
    const fileName = generateUniqueFilename(file.name);
    const filePath = `attachments/${fileName}`;

    console.log(`Uploading ${file.name} to tickets bucket...`);

    const { error: uploadError, data } = await supabase.storage
      .from(TICKETS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        fileName: file.name,
        error: getUploadErrorMessage(uploadError),
      };
    }

    if (!data?.path) {
      return {
        success: false,
        fileName: file.name,
        error: 'Upload completed but no file path returned',
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(TICKETS_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        fileName: file.name,
        error: 'Failed to get public URL for uploaded file',
      };
    }

    console.log(`Successfully uploaded ${file.name}`);

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: file.name,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      fileName: file.name,
      error: getUploadErrorMessage(error as Error),
    };
  }
}

/**
 * Upload multiple images to the tickets bucket
 */
export async function uploadTicketAttachments(
  files: File[]
): Promise<UploadAttachmentsResult> {
  if (files.length === 0) {
    return {
      urls: [],
      errors: [],
      allSuccessful: true,
      partialSuccess: false,
    };
  }

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await uploadTicketAttachment(file);
    if (result.success && result.url) {
      urls.push(result.url);
    } else {
      errors.push(result.error || `Failed to upload ${file.name}`);
    }
  }

  return {
    urls,
    errors,
    allSuccessful: errors.length === 0 && urls.length === files.length,
    partialSuccess: urls.length > 0 && errors.length > 0,
  };
}
