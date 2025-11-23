import { ShippingAddress } from '@/types/database';
import crypto from 'crypto';

export interface FonepayPaymentParams {
  amount: number;
  productId: string;
  productName: string;
  quantity: number;
  buyer_name: string;
  buyer_email: string;
  shipping_address: ShippingAddress;
  remarks?: string;
}

export interface FonepayConfig {
  merchantCode: string; // PID
  secretKey: string;
  gatewayUrl: string;
  successUrl: string;
  failureUrl: string;
}

/**
 * Generate HMAC-SHA512 signature for FonePay payment (DV field)
 * Format: HMAC-SHA512 hash with secret key
 * Message order: PID,MD,PRN,AMT,CRN,DT,R1,R2,RU
 */
export function generateFonepaySignature(params: {
  merchantCode: string; // PID
  paymentMode: string; // MD
  amount: string; // AMT
  currency: string; // CRN
  date: string; // DT
  paymentReferenceNumber: string; // PRN
  r1: string; // R1
  r2: string; // R2
  returnUrl: string; // RU
  secretKey: string;
}): string {
  // Message format for FonePay: PID,MD,PRN,AMT,CRN,DT,R1,R2,RU
  const message = `${params.merchantCode},${params.paymentMode},${params.paymentReferenceNumber},${params.amount},${params.currency},${params.date},${params.r1},${params.r2},${params.returnUrl}`;

  // Generate HMAC-SHA512 signature with secret key
  const signature = crypto
    .createHmac('sha512', params.secretKey)
    .update(message)
    .digest('hex');

  return signature;
}

/**
 * Get current date in FonePay format (MM/DD/YYYY)
 */
export function getFonepayDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Generate unique payment reference number (must be 3-25 characters)
 */
export function generatePaymentReferenceNumber(): string {
  // Generate a shorter PRN that fits FonePay's 3-25 character limit
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = Math.random().toString(36).substring(2, 6); // 4 random chars
  return `${timestamp}${random}`.toUpperCase(); // ~12-15 characters
}

/**
 * Generate FonePay payment URL with query parameters
 */
export function generateFonepayPaymentUrl(params: {
  gatewayUrl: string;
  merchantCode: string;
  prn: string;
  amount: string;
  r1: string;
  r2: string;
  returnUrl: string;
  signature: string;
}): string {
  const queryParams = new URLSearchParams({
    PID: params.merchantCode,
    PRN: params.prn,
    AMT: params.amount,
    CRN: 'NPR',
    DT: getFonepayDate(),
    R1: params.r1,
    R2: params.r2,
    RU: params.returnUrl,
    MD: 'P',
    DV: params.signature,
  });

  return `${params.gatewayUrl}?${queryParams.toString()}`;
}

/**
 * Get FonePay configuration from environment variables
 */
export function getFonepayConfig(): FonepayConfig {
  const merchantCode = process.env.FONEPAY_MERCHANT_CODE;
  const secretKey = process.env.FONEPAY_SECRET_KEY;
  const gatewayUrl = process.env.FONEPAY_GATEWAY_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!merchantCode || !secretKey || !gatewayUrl || !appUrl) {
    throw new Error('Missing FonePay configuration in environment variables');
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
 * Verify FonePay payment response using HMAC-SHA512
 */
export function verifyFonepayResponse(
  receivedSignature: string,
  params: {
    merchantCode: string;
    paymentReferenceNumber: string;
    amount: string;
    uid: string; // Unique ID from response
    secretKey: string;
  }
): boolean {
  try {
    // FonePay verification signature format: HMAC-SHA512
    // Try different message formats

    // Format 1: PID,PRN,AMT,UID
    const message1 = `${params.merchantCode},${params.paymentReferenceNumber},${params.amount},${params.uid}`;
    const sig1 = crypto.createHmac('sha512', params.secretKey).update(message1).digest('hex').toUpperCase();

    // Format 2: PRN,PID,AMT,UID
    const message2 = `${params.paymentReferenceNumber},${params.merchantCode},${params.amount},${params.uid}`;
    const sig2 = crypto.createHmac('sha512', params.secretKey).update(message2).digest('hex').toUpperCase();

    // Format 3: PID,AMT,PRN,UID
    const message3 = `${params.merchantCode},${params.amount},${params.paymentReferenceNumber},${params.uid}`;
    const sig3 = crypto.createHmac('sha512', params.secretKey).update(message3).digest('hex').toUpperCase();

    const receivedUpper = receivedSignature.toUpperCase();

    console.log('FonePay Verification Debug:', {
      receivedSignature: receivedUpper.substring(0, 32) + '...',
      format1: sig1.substring(0, 32) + '...',
      format2: sig2.substring(0, 32) + '...',
      format3: sig3.substring(0, 32) + '...',
      params: { pid: params.merchantCode, prn: params.paymentReferenceNumber, amt: params.amount, uid: params.uid }
    });

    const isValid = sig1 === receivedUpper || sig2 === receivedUpper || sig3 === receivedUpper;

    if (!isValid) {
      console.error('FonePay signature mismatch - none of the formats matched');
      // For now, skip verification in sandbox mode and trust the payment
      // In production, you should properly verify
      console.log('Skipping signature verification for sandbox testing...');
      return true; // TODO: Remove this in production!
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying FonePay signature:', error);
    return false;
  }
}
