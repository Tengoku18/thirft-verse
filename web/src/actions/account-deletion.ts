'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';
import { AccountDeletionRequest } from '@/types/database';

interface RequestAccountDeletionParams {
  email: string;
  reason: string;
}

interface RequestAccountDeletionResult {
  success: boolean;
  message: string;
  data?: AccountDeletionRequest;
}

/**
 * Request account deletion
 * This function:
 * 1. Finds the user by email
 * 2. Updates their profile config to mark requestedForDeletion as true
 * 3. Creates a record in account_deletion_requests table
 */
export async function requestAccountDeletion({
  email,
  reason,
}: RequestAccountDeletionParams): Promise<RequestAccountDeletionResult> {
  try {
    const supabase = createServiceRoleClient();

    // 1. Find the user by email in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching users:', authError);
      return {
        success: false,
        message: 'Failed to process your request. Please try again later.',
      };
    }

    const user = authData.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return {
        success: false,
        message: 'No account found with this email address.',
      };
    }

    // 2. Check if there's already a pending deletion request
    const { data: existingRequest, error: existingError } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing request:', existingError);
      return {
        success: false,
        message: 'Failed to process your request. Please try again later.',
      };
    }

    if (existingRequest) {
      return {
        success: false,
        message: 'You already have a pending deletion request. Please wait for it to be processed.',
      };
    }

    // 3. Update the profile config to mark requestedForDeletion as true and disable account
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        config: {
          status: 'suspended',
          requestedForDeletion: true,
        },
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile config:', profileError);
      return {
        success: false,
        message: 'Failed to process your request. Please try again later.',
      };
    }

    // 4. Create the deletion request record
    const { data: deletionRequest, error: deletionError } = await supabase
      .from('account_deletion_requests')
      .insert({
        user_id: user.id,
        email: email.toLowerCase(),
        reason: reason,
        status: 'pending',
      })
      .select()
      .single();

    if (deletionError) {
      console.error('Error creating deletion request:', deletionError);
      // Rollback the profile config change
      await supabase
        .from('profiles')
        .update({
          config: {
            status: 'active',
            requestedForDeletion: false,
          },
        })
        .eq('id', user.id);

      return {
        success: false,
        message: 'Failed to create deletion request. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Your account deletion request has been submitted successfully. We will process it within 30 days.',
      data: deletionRequest,
    };
  } catch (error) {
    console.error('Failed to request account deletion:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}

/**
 * Get deletion request status by email
 */
export async function getDeletionRequestByEmail(
  email: string
): Promise<AccountDeletionRequest | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching deletion request:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch deletion request:', error);
    return null;
  }
}

/**
 * Get all pending deletion requests (for admin use)
 */
export async function getPendingDeletionRequests(): Promise<AccountDeletionRequest[]> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('status', 'pending')
      .order('requested_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending deletion requests:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch pending deletion requests:', error);
    return [];
  }
}
