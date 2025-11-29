'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';

export interface CreateTicketParams {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachments?: string[];
}

export interface CreateTicketResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

/**
 * Create a new support ticket from the contact form
 */
export async function createTicket(
  params: CreateTicketParams
): Promise<CreateTicketResult> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        full_name: params.full_name,
        email: params.email,
        phone: params.phone,
        subject: params.subject,
        message: params.message,
        attachments: params.attachments || [],
        status: 'open',
        priority: 'medium',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      ticketId: data.id,
    };
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create ticket',
    };
  }
}

/**
 * Get all tickets (for admin dashboard)
 */
export async function getTickets(params?: {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  limit?: number;
  offset?: number;
}) {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (params?.status) {
      query = query.eq('status', params.status);
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
      console.error('Error fetching tickets:', error);
      throw new Error(error.message);
    }

    return { data: data || [], count };
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    throw error;
  }
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  ticketId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    const updateData: {
      status: string;
      admin_notes?: string;
      resolved_at?: string;
    } = { status };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket status:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update ticket status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update ticket',
    };
  }
}
