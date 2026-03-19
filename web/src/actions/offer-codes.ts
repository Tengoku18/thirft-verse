'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';
import { AppliedOfferCodeSummary } from '@/types/offer-codes';

const OFFER_CODE_REGEX = /^[A-Z0-9_-]{4,24}$/;
const MAX_DISCOUNT_PERCENT = 90;

interface ValidateOfferCodeParams {
  sellerId: string;
  code: string;
  itemsSubtotal: number;
}

interface RecordOfferCodeUsageParams {
  offerCodeId: string;
  ownerUserId: string;
  clientUserId?: string | null;
  clientEmail?: string | null;
  orderId: string;
  itemsSubtotal: number;
  discountPercent: number;
  discountAmount: number;
  discountedItemsTotal: number;
  finalAmount: number;
  metadata?: Record<string, unknown>;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeOfferCode(code: string) {
  return code.trim().toUpperCase();
}

function buildOfferSummary(
  row: {
    id: string;
    code: string;
    discount_percent: number;
    expires_at: string;
  },
  itemsSubtotal: number
): AppliedOfferCodeSummary {
  const normalizedSubtotal = roundCurrency(itemsSubtotal);
  const discountAmount = roundCurrency(
    normalizedSubtotal * (Number(row.discount_percent) / 100)
  );
  const discountedItemsTotal = roundCurrency(
    normalizedSubtotal - discountAmount
  );

  return {
    offerCodeId: row.id,
    code: row.code,
    discountPercent: Number(row.discount_percent),
    itemsSubtotal: normalizedSubtotal,
    discountAmount,
    discountedItemsTotal,
    expiresAt: row.expires_at,
  };
}

export async function resolveAppliedOfferForCheckout(
  params: ValidateOfferCodeParams
): Promise<{
  success: boolean;
  offer?: AppliedOfferCodeSummary;
  error?: string;
}> {
  try {
    const normalizedCode = normalizeOfferCode(params.code);
    if (!OFFER_CODE_REGEX.test(normalizedCode)) {
      return { success: false, error: 'Enter a valid offer code.' };
    }

    if (!params.sellerId) {
      return { success: false, error: 'Seller not found for this checkout.' };
    }

    if (!Number.isFinite(params.itemsSubtotal) || params.itemsSubtotal <= 0) {
      return {
        success: false,
        error: 'Offer code cannot be applied to an empty order.',
      };
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('offer_codes')
      .select('id, code, discount_percent, expires_at')
      .eq('owner_user_id', params.sellerId)
      .eq('code_normalized', normalizedCode)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      console.error('Offer code lookup failed:', error);
      return {
        success: false,
        error: 'Could not validate offer code right now.',
      };
    }

    if (!data) {
      return { success: false, error: 'Invalid offer code for this store.' };
    }

    if (new Date(data.expires_at).getTime() <= Date.now()) {
      return { success: false, error: 'This offer code has expired.' };
    }

    const discountPercent = Number(data.discount_percent);
    if (discountPercent <= 0 || discountPercent > MAX_DISCOUNT_PERCENT) {
      return { success: false, error: 'This offer code is not valid anymore.' };
    }

    return {
      success: true,
      offer: buildOfferSummary(data, params.itemsSubtotal),
    };
  } catch (error) {
    console.error('resolveAppliedOfferForCheckout failed:', error);
    return {
      success: false,
      error: 'Could not validate offer code right now.',
    };
  }
}

export async function validateOfferCodeForCheckout(
  params: ValidateOfferCodeParams
): Promise<{
  success: boolean;
  offer?: AppliedOfferCodeSummary;
  error?: string;
}> {
  return resolveAppliedOfferForCheckout(params);
}

export async function recordOfferCodeUsage(
  params: RecordOfferCodeUsageParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from('offer_code_usages').upsert(
      {
        offer_code_id: params.offerCodeId,
        owner_user_id: params.ownerUserId,
        client_user_id: params.clientUserId || null,
        client_email: params.clientEmail || null,
        order_id: params.orderId,
        items_subtotal: roundCurrency(params.itemsSubtotal),
        discount_percent: params.discountPercent,
        discount_amount: roundCurrency(params.discountAmount),
        discounted_items_total: roundCurrency(params.discountedItemsTotal),
        final_amount: roundCurrency(params.finalAmount),
        metadata: params.metadata || null,
      },
      { onConflict: 'order_id' }
    );

    if (error) {
      console.error('recordOfferCodeUsage failed:', error);
      return { success: false, error: 'Failed to record offer code usage.' };
    }

    return { success: true };
  } catch (error) {
    console.error('recordOfferCodeUsage unexpected failure:', error);
    return { success: false, error: 'Failed to record offer code usage.' };
  }
}
