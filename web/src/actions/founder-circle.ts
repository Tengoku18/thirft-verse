'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FounderCircleApplication {
  id: string;
  full_name: string;
  email: string;
  is_creator: boolean;
  is_seller: boolean;
  instagram_link: string | null;
  tiktok_link: string | null;
  other_link: string | null;
  is_approved: boolean;
  approved_at: string | null;
  founder_access_code: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplyToFounderCircleParams {
  full_name: string;
  email: string;
  is_creator: boolean;
  is_seller: boolean;
  instagram_link?: string | null;
  tiktok_link?: string | null;
  other_link?: string | null;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Map Supabase / Postgres constraint names to user-friendly messages. */
function mapDbError(code: string, constraint?: string): string {
  if (code === '23505') {
    if (constraint === 'unique_email' || constraint === 'founder_circle_applications_email_key') {
      return 'An application with this email already exists.';
    }
    if (constraint === 'founder_circle_applications_founder_access_code_key') {
      return 'Access code conflict. Please try again.';
    }
    return 'A duplicate entry was detected. Please check your details.';
  }
  if (code === '23514') {
    if (constraint === 'at_least_one_social') {
      return 'Please provide at least one social profile link.';
    }
    if (constraint === 'at_least_one_role') {
      return 'Please select at least one role (Creator or Seller).';
    }
  }
  return 'Failed to submit your application. Please try again.';
}

// ─────────────────────────────────────────────
// Public — Submit Application
// ─────────────────────────────────────────────

/**
 * Submit a new Founder Circle application.
 * Validates inputs server-side before hitting the DB.
 */
export async function applyToFounderCircle(
  params: ApplyToFounderCircleParams
): Promise<ActionResult> {
  // ── Server-side validation ──────────────────
  const fullName = params.full_name?.trim();
  const email = params.email?.toLowerCase().trim();
  const instagramLink = params.instagram_link?.trim() || null;
  const tiktokLink = params.tiktok_link?.trim() || null;
  const otherLink = params.other_link?.trim() || null;

  if (!fullName || fullName.length < 2 || fullName.length > 100) {
    return { success: false, error: 'Full name must be between 2 and 100 characters.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Enter a valid email address.' };
  }
  if (!params.is_creator && !params.is_seller) {
    return { success: false, error: 'Please select at least one role (Creator or Seller).' };
  }
  if (!instagramLink && !tiktokLink && !otherLink) {
    return { success: false, error: 'Please provide at least one social profile link.' };
  }

  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from('founder_circle_applications').insert({
      full_name: fullName,
      email,
      is_creator: params.is_creator,
      is_seller: params.is_seller,
      instagram_link: instagramLink,
      tiktok_link: tiktokLink,
      other_link: otherLink,
      is_approved: false,
    });

    if (error) {
      console.error('Error creating founder circle application:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        success: false,
        error: mapDbError(error.code, error.details ?? undefined),
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to submit founder circle application:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}

// ─────────────────────────────────────────────
// Admin — Read Applications
// ─────────────────────────────────────────────

export interface GetFounderCircleApplicationsParams {
  is_approved?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Fetch founder circle applications (admin use — service role only).
 */
export async function getFounderCircleApplications(
  params?: GetFounderCircleApplicationsParams
): Promise<{ data: FounderCircleApplication[]; count: number | null }> {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('founder_circle_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (params?.is_approved !== undefined) {
      query = query.eq('is_approved', params.is_approved);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset && params?.limit) {
      query = query.range(params.offset, params.offset + params.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching founder circle applications:', error);
      throw new Error(error.message);
    }

    return { data: (data as FounderCircleApplication[]) ?? [], count };
  } catch (error) {
    console.error('Failed to fetch founder circle applications:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────
// Admin — Approve Application
// ─────────────────────────────────────────────

export interface ApproveFounderCircleParams {
  id: string;
  founder_access_code: string;
  admin_notes?: string;
}

/**
 * Approve a founder circle application and issue an access code.
 */
export async function approveFounderCircleApplication(
  params: ApproveFounderCircleParams
): Promise<ActionResult> {
  if (!params.id) return { success: false, error: 'Application ID is required.' };
  if (!params.founder_access_code?.trim()) {
    return { success: false, error: 'An access code is required to approve the application.' };
  }

  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('founder_circle_applications')
      .update({
        is_approved: true,
        founder_access_code: params.founder_access_code.trim(),
        ...(params.admin_notes ? { admin_notes: params.admin_notes.trim() } : {}),
      })
      .eq('id', params.id);

    if (error) {
      console.error('Error approving founder circle application:', {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      return {
        success: false,
        error: mapDbError(error.code, error.details ?? undefined),
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to approve founder circle application:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

// ─────────────────────────────────────────────
// Admin — Update Notes
// ─────────────────────────────────────────────

/**
 * Update admin notes on an application without changing approval status.
 */
export async function updateFounderCircleNotes(
  id: string,
  admin_notes: string
): Promise<ActionResult> {
  if (!id) return { success: false, error: 'Application ID is required.' };

  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('founder_circle_applications')
      .update({ admin_notes: admin_notes.trim() })
      .eq('id', id);

    if (error) {
      console.error('Error updating founder circle notes:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update founder circle notes:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
