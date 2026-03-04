'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';

export interface ApplyToFounderCircleParams {
  full_name: string;
  email: string;
  is_creator: boolean;
  is_seller: boolean;
  instagram_link?: string | null;
  tiktok_link?: string | null;
  other_link?: string | null;
}

export interface ApplyToFounderCircleResult {
  success: boolean;
  error?: string;
}

export async function applyToFounderCircle(
  params: ApplyToFounderCircleParams
): Promise<ApplyToFounderCircleResult> {
  try {
    const supabase = createServiceRoleClient();

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('founder_circle_applications')
      .select('id')
      .eq('email', params.email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: 'An application with this email already exists.',
      };
    }

    const { error } = await supabase.from('founder_circle_applications').insert({
      full_name: params.full_name.trim(),
      email: params.email.toLowerCase().trim(),
      is_creator: params.is_creator,
      is_seller: params.is_seller,
      instagram_link: params.instagram_link || null,
      tiktok_link: params.tiktok_link || null,
      other_link: params.other_link || null,
      is_approved: false,
    });

    if (error) {
      console.error('Error creating founder circle application:', error);
      return {
        success: false,
        error: 'Failed to submit your application. Please try again.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to submit founder circle application:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }
}
