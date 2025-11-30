import { ShippingAddress } from '@/types/database';
import crypto from 'crypto';

export interface EsewaPaymentParams {
  amount: number;
  productId: string;
  productName: string;
  quantity: number;
  taxAmount?: number;
  deliveryCharge?: number;
  shippingOption?: 'home' | 'branch';
  buyer_name: string;
  buyer_email: string;
  shipping_address: ShippingAddress;
}

export interface EsewaConfig {
  merchantCode: string;
  secretKey: string;
  gatewayUrl: string;
  successUrl: string;
  failureUrl: string;
}

/**
 * Generate HMAC-SHA256 signature for eSewa payment
 */
export function generateEsewaSignature(
  message: string,
  secretKey: string
): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}

/**
 * Create signature message string for eSewa
 */
export function createSignatureMessage(params: {
  totalAmount: string;
  transactionUuid: string;
  productCode: string;
}): string {
  return `total_amount=${params.totalAmount},transaction_uuid=${params.transactionUuid},product_code=${params.productCode}`;
}

/**
 * Generate unique transaction UUID
 */
export function generateTransactionUuid(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get eSewa configuration from environment variables
 */
export function getEsewaConfig(): EsewaConfig {
  const merchantCode = process.env.ESEWA_MERCHANT_CODE;
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const gatewayUrl = process.env.ESEWA_GATEWAY_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!merchantCode || !secretKey || !gatewayUrl || !appUrl) {
    throw new Error('Missing eSewa configuration in environment variables');
  }

  return {
    merchantCode,
    secretKey,
    gatewayUrl,
    successUrl: `${appUrl}/payment/success`,
    failureUrl: `${appUrl}/payment/failed`,
  };
}

/**
 * Verify eSewa payment signature on callback
 */
export function verifyEsewaSignature(
  data: string,
  receivedSignature: string,
  secretKey: string
): boolean {
  try {
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedData);

    // Get the signed field names from the response
    const signedFieldNames = parsedData.signed_field_names;
    if (!signedFieldNames) {
      console.error('No signed_field_names in response');
      return false;
    }

    // Build the message using only the signed fields
    const fields = signedFieldNames.split(',');
    const messageParts = fields.map((field: string) => {
      const fieldName = field.trim();
      return `${fieldName}=${parsedData[fieldName]}`;
    });
    const message = messageParts.join(',');

    const calculatedSignature = generateEsewaSignature(message, secretKey);
    const isValid = calculatedSignature === receivedSignature;

    if (!isValid) {
      console.error('Signature mismatch:', {
        calculated: calculatedSignature,
        received: receivedSignature,
      });
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}
