'use server'

import { headers } from 'next/headers'
import {
  createSignatureMessage,
  generateEsewaSignature,
  generateTransactionUuid,
  getEsewaConfig,
  verifyEsewaSignature,
  type EsewaPaymentParams,
} from '@/lib/esewa/utils'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { createOrder } from './orders'
import { getProductById } from './products'

interface InitiatePaymentResult {
  success: boolean
  formHtml?: string
  error?: string
  transactionUuid?: string
}

interface VerifyPaymentResult {
  success: boolean
  data?: {
    transactionCode: string
    amount: string
    status: string
    transactionUuid: string
  }
  error?: string
}

/**
 * Initiate eSewa payment - generates HTML form that auto-submits to eSewa
 */
export async function initiateEsewaPayment(
  params: EsewaPaymentParams
): Promise<InitiatePaymentResult> {
  try {
    const config = getEsewaConfig()
    const transactionUuid = generateTransactionUuid()

    // Get current host from headers to preserve subdomain
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    // Calculate total amount
    const taxAmount = params.taxAmount || 0
    const deliveryCharge = params.deliveryCharge || 0
    const totalAmount = params.amount + taxAmount + deliveryCharge

    // Get product details to find seller
    const product = await getProductById({ id: params.productId })
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    // Store payment metadata for order creation after payment success
    const supabase = createServiceRoleClient()
    const { error: metadataError } = await supabase
      .from('payment_metadata')
      .insert({
        transaction_uuid: transactionUuid,
        product_id: params.productId,
        seller_id: product.store_id,
        buyer_email: params.buyer_email,
        buyer_name: params.buyer_name,
        shipping_address: params.shipping_address,
        amount: totalAmount,
      })

    if (metadataError) {
      console.error('Error storing payment metadata:', metadataError)
      return {
        success: false,
        error: 'Failed to initialize payment',
      }
    }

    // Create signature message
    const signatureMessage = createSignatureMessage({
      totalAmount: totalAmount.toString(),
      transactionUuid,
      productCode: config.merchantCode,
    })

    // Generate signature
    const signature = generateEsewaSignature(
      signatureMessage,
      config.secretKey
    )

    // Create HTML form that will auto-submit to eSewa
    const formHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to eSewa...</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #3B2F2F 0%, #D4A373 100%);
            }
            .loader {
              text-align: center;
              color: white;
              background: rgba(255, 255, 255, 0.1);
              padding: 3rem 4rem;
              border-radius: 1rem;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .spinner {
              border: 4px solid rgba(212, 163, 115, 0.3);
              border-radius: 50%;
              border-top: 4px solid #D4A373;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 0 auto 24px;
            }
            h2 {
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
              font-weight: 600;
            }
            p {
              font-size: 1rem;
              opacity: 0.9;
              margin: 0;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loader">
            <div class="spinner"></div>
            <h2>Redirecting to eSewa Payment Gateway...</h2>
            <p>Please wait while we redirect you to complete your payment</p>
          </div>
          <form id="esewaForm" action="${config.gatewayUrl}" method="POST">
            <input type="hidden" name="amount" value="${params.amount}" />
            <input type="hidden" name="tax_amount" value="${taxAmount}" />
            <input type="hidden" name="total_amount" value="${totalAmount}" />
            <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />
            <input type="hidden" name="product_code" value="${config.merchantCode}" />
            <input type="hidden" name="product_service_charge" value="${deliveryCharge}" />
            <input type="hidden" name="product_delivery_charge" value="0" />
            <input type="hidden" name="success_url" value="${baseUrl}/payment/success" />
            <input type="hidden" name="failure_url" value="${baseUrl}/payment/failed" />
            <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
            <input type="hidden" name="signature" value="${signature}" />
          </form>
          <script>
            document.getElementById('esewaForm').submit();
          </script>
        </body>
      </html>
    `

    return {
      success: true,
      formHtml,
      transactionUuid,
    }
  } catch (error) {
    console.error('Failed to initiate eSewa payment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate payment',
    }
  }
}

/**
 * Verify eSewa payment after callback
 */
export async function verifyEsewaPayment(
  data: string,
  signature: string
): Promise<VerifyPaymentResult> {
  try {
    console.log('Starting payment verification...')
    const config = getEsewaConfig()

    // Decode payment data first for logging
    const decodedData = Buffer.from(data, 'base64').toString('utf-8')
    const paymentData = JSON.parse(decodedData)

    console.log('Decoded payment data:', {
      transaction_code: paymentData.transaction_code,
      status: paymentData.status,
      total_amount: paymentData.total_amount,
      transaction_uuid: paymentData.transaction_uuid,
    })

    // Verify signature
    const isValid = verifyEsewaSignature(data, signature, config.secretKey)

    if (!isValid) {
      console.error('Payment signature verification failed')
      return {
        success: false,
        error: 'Invalid payment signature',
      }
    }

    // Retrieve payment metadata to create order
    const supabase = createServiceRoleClient()
    const { data: metadata, error: metadataFetchError } = await supabase
      .from('payment_metadata')
      .select('*')
      .eq('transaction_uuid', paymentData.transaction_uuid)
      .single()

    if (metadataFetchError || !metadata) {
      console.error('Error fetching payment metadata:', metadataFetchError)
      // Payment is verified, but we couldn't create order
      // Log this for manual processing
      console.error('CRITICAL: Payment verified but order creation failed - transaction_uuid:', paymentData.transaction_uuid)
    } else if (!metadata.is_processed) {
      // Create order from payment metadata
      const orderResult = await createOrder({
        seller_id: metadata.seller_id,
        product_id: metadata.product_id,
        buyer_email: metadata.buyer_email,
        buyer_name: metadata.buyer_name,
        shipping_address: metadata.shipping_address,
        transaction_code: paymentData.transaction_code,
        transaction_uuid: paymentData.transaction_uuid,
        amount: parseFloat(paymentData.total_amount),
        payment_method: 'eSewa',
      })

      if (orderResult.success) {
        // Mark metadata as processed
        await supabase
          .from('payment_metadata')
          .update({ is_processed: true })
          .eq('transaction_uuid', paymentData.transaction_uuid)

        console.log('Order created successfully:', orderResult.order?.id)
      } else {
        console.error('Failed to create order:', orderResult.error)
      }
    }

    console.log('Payment verified successfully!')

    return {
      success: true,
      data: {
        transactionCode: paymentData.transaction_code,
        amount: paymentData.total_amount,
        status: paymentData.status,
        transactionUuid: paymentData.transaction_uuid,
      },
    }
  } catch (error) {
    console.error('Failed to verify payment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    }
  }
}

/**
 * Handle payment failure
 */
export async function handlePaymentFailure(
  transactionUuid?: string
): Promise<void> {
  try {
    console.log('Payment failed for transaction:', transactionUuid)

    // Here you can:
    // 1. Update order status to failed in your database
    // 2. Log the failed transaction
    // 3. Send notification
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}
