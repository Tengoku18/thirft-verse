'use server';

import { sendOrderEmails } from '@/lib/email/send';
import {
  createSignatureMessage,
  generateEsewaSignature,
  generateTransactionUuid,
  getEsewaConfig,
  verifyEsewaSignature,
  type EsewaPaymentParams,
} from '@/lib/esewa/utils';
import {
  generateFonepayPaymentUrl,
  generateFonepaySignature,
  generatePaymentReferenceNumber,
  getFonepayConfig,
  getFonepayDate,
  verifyFonepayResponse,
  type FonepayPaymentParams,
} from '@/lib/fonepay/utils';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { ShippingAddress } from '@/types/database';
import { headers } from 'next/headers';
import { CartItem } from '@/types/cart';
import { createMultiProductOrder, createOrder, getOrderByTransactionUuid } from './orders';
import { getProductById } from './products';

interface CodOrderParams {
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  shippingFee: number;
  shippingOption: 'home' | 'branch';
  buyer_name: string;
  buyer_email: string;
  shipping_address: ShippingAddress;
  buyer_notes?: string;
}

interface MultiProductCodOrderParams {
  storeId: string;
  items: CartItem[];
  shippingFee: number;
  shippingOption: 'home' | 'branch';
  buyer_name: string;
  buyer_email: string;
  shipping_address: ShippingAddress;
  buyer_notes?: string;
}

interface MultiProductPaymentParams {
  storeId: string;
  storeName: string;
  items: CartItem[];
  shippingFee: number;
  shippingOption: 'home' | 'branch';
  buyer_name: string;
  buyer_email: string;
  shipping_address: ShippingAddress;
  buyer_notes?: string;
}

interface CodOrderResult {
  success: boolean;
  orderId?: string;
  orderCode?: string;
  error?: string;
}

interface InitiatePaymentResult {
  success: boolean;
  formHtml?: string;
  error?: string;
  transactionUuid?: string;
}

interface VerifyPaymentResult {
  success: boolean;
  data?: {
    transactionCode: string;
    amount: string;
    status: string;
    transactionUuid: string;
    metadata?: {
      seller_id: string;
      product_id: string;
      quantity: number;
      buyer_email: string;
      buyer_name: string;
      shipping_address: ShippingAddress;
      is_processed: boolean;
    };
  };
  error?: string;
}

interface CreateOrderFromPaymentResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Initiate eSewa payment - generates HTML form that auto-submits to eSewa
 */
export async function initiateEsewaPayment(
  params: EsewaPaymentParams
): Promise<InitiatePaymentResult> {
  try {
    const config = getEsewaConfig();
    const transactionUuid = generateTransactionUuid();

    // Get current host from headers to preserve subdomain
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Calculate total amount
    const taxAmount = params.taxAmount || 0;
    const deliveryCharge = params.deliveryCharge || 0;
    const totalAmount = params.amount + taxAmount + deliveryCharge;

    // Get product details to find seller
    const product = await getProductById({ id: params.productId });
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    // Store payment metadata for order creation after payment success
    const supabase = createServiceRoleClient();
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
        quantity: params.quantity,
        shipping_option: params.shippingOption || null,
        buyer_notes: params.buyer_notes || null,
      });

    if (metadataError) {
      console.error('Error storing payment metadata:', metadataError);
      return {
        success: false,
        error: 'Failed to initialize payment',
      };
    }

    // Create signature message
    const signatureMessage = createSignatureMessage({
      totalAmount: totalAmount.toString(),
      transactionUuid,
      productCode: config.merchantCode,
    });

    // Generate signature
    const signature = generateEsewaSignature(
      signatureMessage,
      config.secretKey
    );

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
    `;

    return {
      success: true,
      formHtml,
      transactionUuid,
    };
  } catch (error) {
    console.error('Failed to initiate eSewa payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
}

export async function verifyEsewaPayment(
  data: string,
  signature: string
): Promise<VerifyPaymentResult> {
  try {
    const config = getEsewaConfig();

    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const paymentData = JSON.parse(decodedData);

    const isValid = verifyEsewaSignature(data, signature, config.secretKey);

    if (!isValid) {
      console.error('Payment signature verification failed');
      return {
        success: false,
        error: 'Invalid payment signature',
      };
    }

    // Retrieve payment metadata for order creation later
    const supabase = createServiceRoleClient();
    const { data: metadata, error: metadataFetchError } = await supabase
      .from('payment_metadata')
      .select('*')
      .eq('transaction_uuid', paymentData.transaction_uuid)
      .single();

    if (metadataFetchError || !metadata) {
      console.error('Error fetching payment metadata:', metadataFetchError);
      return {
        success: false,
        error: 'Payment verified but metadata not found',
      };
    }

    // Store transaction code in metadata for order creation
    await supabase
      .from('payment_metadata')
      .update({ transaction_code: paymentData.transaction_code })
      .eq('transaction_uuid', paymentData.transaction_uuid);

    console.log('Payment verified successfully!');

    return {
      success: true,
      data: {
        transactionCode: paymentData.transaction_code,
        amount: paymentData.total_amount,
        status: paymentData.status,
        transactionUuid: paymentData.transaction_uuid,
        metadata: {
          seller_id: metadata.seller_id,
          product_id: metadata.product_id,
          quantity: metadata.quantity || 1,
          buyer_email: metadata.buyer_email,
          buyer_name: metadata.buyer_name,
          shipping_address: metadata.shipping_address,
          is_processed: metadata.is_processed,
        },
      },
    };
  } catch (error) {
    console.error('Failed to verify payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/**
 * Create order from verified payment
 * This should be called after payment verification is successful
 */
export async function createOrderFromPayment(
  transactionUuid: string,
  transactionCode?: string
): Promise<CreateOrderFromPaymentResult> {
  try {
    console.log('Creating order for transaction:', transactionUuid);

    const supabase = createServiceRoleClient();

    // Fetch payment metadata
    const { data: metadata, error: metadataFetchError } = await supabase
      .from('payment_metadata')
      .select('*')
      .eq('transaction_uuid', transactionUuid)
      .single();

    if (metadataFetchError || !metadata) {
      console.error('Error fetching payment metadata:', metadataFetchError);
      return {
        success: false,
        error: 'Payment metadata not found',
      };
    }

    // Check if already processed
    if (metadata.is_processed) {
      console.log('Payment already processed, returning existing order');

      // Get the existing order
      const existingOrder = await getOrderByTransactionUuid(transactionUuid);
      if (existingOrder) {
        return {
          success: true,
          orderId: existingOrder.id,
        };
      }
    }

    // Calculate shipping fee from metadata if shipping option is stored
    let shippingFee = 0;
    if (metadata.shipping_option === 'home') {
      shippingFee = 170;
    } else if (metadata.shipping_option === 'branch') {
      shippingFee = 120;
    }

    // Use passed transactionCode first, then metadata, then fallback to transactionUuid
    const finalTransactionCode = transactionCode || metadata.transaction_code || transactionUuid;

    // Check if this is a multi-product order (cart_items exists)
    let orderResult;

    if (metadata.cart_items && Array.isArray(metadata.cart_items)) {
      // Multi-product order
      console.log('Creating multi-product order from payment');

      orderResult = await createMultiProductOrder({
        seller_id: metadata.seller_id,
        items: metadata.cart_items,
        buyer_email: metadata.buyer_email,
        buyer_name: metadata.buyer_name,
        shipping_address: metadata.shipping_address,
        transaction_code: finalTransactionCode,
        transaction_uuid: transactionUuid,
        total_amount: parseFloat(metadata.amount),
        shipping_fee: shippingFee,
        shipping_option: metadata.shipping_option || null,
        payment_method: metadata.payment_method || 'eSewa',
        buyer_notes: metadata.buyer_notes || null,
      });
    } else {
      // Single product order (legacy flow)
      console.log('Creating single-product order from payment');

      orderResult = await createOrder({
        seller_id: metadata.seller_id,
        product_id: metadata.product_id,
        quantity: metadata.quantity || 1,
        buyer_email: metadata.buyer_email,
        buyer_name: metadata.buyer_name,
        shipping_address: metadata.shipping_address,
        transaction_code: finalTransactionCode,
        transaction_uuid: transactionUuid,
        amount: parseFloat(metadata.amount),
        shipping_fee: shippingFee,
        shipping_option: metadata.shipping_option || null,
        payment_method: metadata.payment_method || 'eSewa',
        buyer_notes: metadata.buyer_notes || null,
      });
    }

    if (!orderResult.success) {
      console.error('Failed to create order:', orderResult.error);
      return {
        success: false,
        error: orderResult.error || 'Failed to create order',
      };
    }

    // Mark metadata as processed
    await supabase
      .from('payment_metadata')
      .update({ is_processed: true })
      .eq('transaction_uuid', transactionUuid);

    console.log('Order created successfully:', orderResult.order?.id);

    // Determine if this is a newly created order or an existing one
    // If order was just created, send emails. If it already existed, skip emails.
    const isNewOrder = !metadata.is_processed;

    // Send confirmation emails only for new orders
    if (isNewOrder) {
      try {
        // Get seller details from profiles
        const { data: seller } = await supabase
          .from('profiles')
          .select('name, store_username, currency')
          .eq('id', metadata.seller_id)
          .single();

        // Get seller email from auth.users
        const { data: authUser } = await supabase.auth.admin.getUserById(
          metadata.seller_id
        );

        const sellerEmail = authUser?.user?.email;

        if (seller && sellerEmail && orderResult.order) {
          let itemName: string;

          // Determine item name based on order type
          if (metadata.cart_items && Array.isArray(metadata.cart_items)) {
            // Multi-product order
            const itemsCount = metadata.cart_items.length;
            const firstItemName = metadata.cart_items[0]?.product_name || 'Product';
            itemName = itemsCount > 1
              ? `${firstItemName} and ${itemsCount - 1} more item${itemsCount > 2 ? 's' : ''}`
              : firstItemName;
          } else {
            // Single product order - get product details
            const product = await getProductById({ id: metadata.product_id });
            itemName = product?.title || 'Product';
          }

          await sendOrderEmails({
            buyer: {
              email: metadata.buyer_email,
              name: metadata.buyer_name,
            },
            seller: {
              email: sellerEmail,
              name: seller.name || seller.store_username || 'Seller',
            },
            order: {
              id: orderResult.order.id,
              orderCode: orderResult.order.order_code || orderResult.order.id,
              date: new Date().toLocaleDateString(),
              total: metadata.amount,
              itemName,
              storeName:
                seller.store_username || seller.name || 'ThriftVerse Store',
              currency: seller.currency || 'NPR',
              shippingFee: shippingFee,
              // Pass order items for multi-product orders
              orderItems: metadata.cart_items && Array.isArray(metadata.cart_items)
                ? metadata.cart_items.map((item: any) => ({
                    productName: item.product_name,
                    quantity: item.quantity,
                    price: item.price,
                  }))
                : undefined,
            },
          });
          console.log('Order confirmation emails sent successfully');
        } else {
          console.error('Could not send emails - missing required data', {
            hasSeller: !!seller,
            hasSellerEmail: !!sellerEmail,
          });
        }
      } catch (emailError) {
        console.error('Failed to send order confirmation emails:', emailError);
        // Don't fail the order creation if email sending fails
      }
    } else {
      console.log('Skipping email sending - order already existed');
    }

    return {
      success: true,
      orderId: orderResult.order?.id,
    };
  } catch (error) {
    console.error('Failed to create order from payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}

/**
 * Create COD (Cash on Delivery) order without payment gateway
 */
export async function createCodOrder(
  params: CodOrderParams
): Promise<CodOrderResult> {
  try {
    // Get product details to find seller
    const product = await getProductById({ id: params.productId });
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    // Calculate total amount (base amount + shipping fee)
    const totalAmount = params.amount + params.shippingFee;

    // Create order directly (no transaction code/uuid needed for COD)
    const orderResult = await createOrder({
      product_id: params.productId,
      seller_id: product.store_id,
      buyer_name: params.buyer_name,
      buyer_email: params.buyer_email,
      shipping_address: params.shipping_address,
      amount: totalAmount,
      shipping_fee: params.shippingFee,
      shipping_option: params.shippingOption,
      quantity: params.quantity,
      payment_method: 'Cash on Delivery',
      status: 'pending',
      buyer_notes: params.buyer_notes,
    });

    if (!orderResult.success || !orderResult.order) {
      return {
        success: false,
        error: orderResult.error || 'Failed to create COD order',
      };
    }

    // Send confirmation emails
    try {
      const supabase = createServiceRoleClient();
      const { data: seller } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', product.store_id)
        .single();

      const { data: authUser } = await supabase.auth.admin.getUserById(product.store_id);
      const sellerEmail = authUser?.user?.email;

      if (product && seller && sellerEmail) {
        await sendOrderEmails({
          buyer: {
            email: params.buyer_email,
            name: params.buyer_name,
          },
          seller: {
            email: sellerEmail,
            name: seller.name || seller.store_username || 'Seller',
          },
          order: {
            id: orderResult.order.id,
            orderCode: orderResult.order.order_code || orderResult.order.id,
            date: new Date().toLocaleDateString(),
            total: totalAmount,
            itemName: product.title,
            storeName: seller.store_username || seller.name || 'ThriftVerse Store',
            currency: seller.currency || 'NPR',
            shippingFee: params.shippingFee,
          },
        });
        console.log('COD order confirmation emails sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send COD order confirmation emails:', emailError);
      // Don't fail the order creation if email sending fails
    }

    return {
      success: true,
      orderId: orderResult.order.id,
      orderCode: orderResult.order.order_code || orderResult.order.id,
    };
  } catch (error) {
    console.error('Failed to create COD order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create COD order',
    };
  }
}

/**
 * Create multi-product COD order
 */
export async function createMultiProductCodOrder(
  params: MultiProductCodOrderParams
): Promise<CodOrderResult> {
  try {
    // Calculate items total
    const itemsTotal = params.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = itemsTotal + params.shippingFee;

    // Prepare order items
    const orderItems = params.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      cover_image: item.coverImage || null,
    }));

    // Create multi-product order
    const orderResult = await createMultiProductOrder({
      seller_id: params.storeId,
      items: orderItems,
      buyer_name: params.buyer_name,
      buyer_email: params.buyer_email,
      shipping_address: params.shipping_address,
      total_amount: totalAmount,
      shipping_fee: params.shippingFee,
      shipping_option: params.shippingOption,
      payment_method: 'Cash on Delivery',
      status: 'pending',
      buyer_notes: params.buyer_notes,
    });

    if (!orderResult.success || !orderResult.order) {
      return {
        success: false,
        error: orderResult.error || 'Failed to create COD order',
      };
    }

    // Send confirmation emails
    try {
      const supabase = createServiceRoleClient();
      const { data: seller } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.storeId)
        .single();

      const { data: authUser } = await supabase.auth.admin.getUserById(params.storeId);
      const sellerEmail = authUser?.user?.email;

      if (seller && sellerEmail) {
        const itemsCount = params.items.length;
        const firstItemName = params.items[0].productName;
        const itemName = itemsCount > 1
          ? `${firstItemName} and ${itemsCount - 1} more item${itemsCount > 2 ? 's' : ''}`
          : firstItemName;

        await sendOrderEmails({
          buyer: {
            email: params.buyer_email,
            name: params.buyer_name,
          },
          seller: {
            email: sellerEmail,
            name: seller.name || seller.store_username || 'Seller',
          },
          order: {
            id: orderResult.order.id,
            orderCode: orderResult.order.order_code || orderResult.order.id,
            date: new Date().toLocaleDateString(),
            total: totalAmount,
            itemName,
            storeName: seller.store_username || seller.name || 'ThriftVerse Store',
            currency: seller.currency || 'NPR',
            shippingFee: params.shippingFee,
            orderItems: params.items.map(item => ({
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        });
        console.log('Multi-product COD order confirmation emails sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send COD order confirmation emails:', emailError);
    }

    return {
      success: true,
      orderId: orderResult.order.id,
      orderCode: orderResult.order.order_code || orderResult.order.id,
    };
  } catch (error) {
    console.error('Failed to create multi-product COD order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create COD order',
    };
  }
}

/**
 * Initiate eSewa payment for multi-product orders
 */
export async function initiateMultiProductEsewaPayment(
  params: MultiProductPaymentParams
): Promise<InitiatePaymentResult> {
  try {
    const config = getEsewaConfig();
    const transactionUuid = generateTransactionUuid();

    // Get current host from headers
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Calculate totals
    const itemsTotal = params.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = itemsTotal + params.shippingFee;

    // Prepare cart items for storage (convert CartItem to storable format)
    const cartItemsForStorage = params.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      cover_image: item.coverImage || null,
    }));

    // Store payment metadata with cart items
    const supabase = createServiceRoleClient();
    const { error: metadataError } = await supabase
      .from('payment_metadata')
      .insert({
        transaction_uuid: transactionUuid,
        product_id: null, // NULL for multi-product orders
        seller_id: params.storeId,
        buyer_email: params.buyer_email,
        buyer_name: params.buyer_name,
        shipping_address: params.shipping_address,
        amount: totalAmount,
        quantity: params.items.reduce((sum, item) => sum + item.quantity, 0),
        shipping_option: params.shippingOption,
        buyer_notes: params.buyer_notes || null,
        cart_items: cartItemsForStorage, // Store cart items as JSONB
      });

    if (metadataError) {
      console.error('Error storing payment metadata:', metadataError);
      return {
        success: false,
        error: 'Failed to initialize payment',
      };
    }

    // Create signature message
    const signatureMessage = createSignatureMessage({
      totalAmount: totalAmount.toString(),
      transactionUuid,
      productCode: config.merchantCode,
    });

    // Generate signature
    const signature = generateEsewaSignature(
      signatureMessage,
      config.secretKey
    );

    // Create product description for eSewa
    const itemsCount = params.items.length;
    const productDescription = itemsCount > 1
      ? `${params.storeName} - ${itemsCount} items`
      : params.items[0].productName;

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
            <input type="hidden" name="amount" value="${itemsTotal}" />
            <input type="hidden" name="tax_amount" value="0" />
            <input type="hidden" name="total_amount" value="${totalAmount}" />
            <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />
            <input type="hidden" name="product_code" value="${config.merchantCode}" />
            <input type="hidden" name="product_service_charge" value="${params.shippingFee}" />
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
    `;

    return {
      success: true,
      formHtml,
      transactionUuid,
    };
  } catch (error) {
    console.error('Failed to initiate multi-product eSewa payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
}

/**
 * Initiate FonePay payment for multi-product orders
 */
export async function initiateMultiProductFonepayPayment(
  params: MultiProductPaymentParams
): Promise<InitiatePaymentResult> {
  try {
    const config = getFonepayConfig();
    const paymentReferenceNumber = generatePaymentReferenceNumber();

    // Get current host from headers
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Calculate totals
    const itemsTotal = params.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = itemsTotal + params.shippingFee;

    // Prepare cart items for storage
    const cartItemsForStorage = params.items.map((item) => ({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      cover_image: item.coverImage || null,
    }));

    // Store payment metadata
    const supabase = createServiceRoleClient();
    const { error: metadataError } = await supabase
      .from('payment_metadata')
      .insert({
        transaction_uuid: paymentReferenceNumber,
        product_id: null, // NULL for multi-product orders
        seller_id: params.storeId,
        buyer_email: params.buyer_email,
        buyer_name: params.buyer_name,
        shipping_address: params.shipping_address,
        amount: totalAmount,
        quantity: params.items.reduce((sum, item) => sum + item.quantity, 0),
        payment_method: 'FonePay',
        shipping_option: params.shippingOption,
        buyer_notes: params.buyer_notes || null,
        cart_items: cartItemsForStorage,
      });

    if (metadataError) {
      console.error('Error storing payment metadata:', metadataError);
      return {
        success: false,
        error: 'Failed to initialize payment',
      };
    }

    // FonePay parameters
    const amount = totalAmount.toFixed(2);
    const currency = 'NPR';
    const paymentMode = 'P';
    const date = getFonepayDate();
    const returnUrl = `${baseUrl}/payment/success`;
    const itemsCount = params.items.length;
    const r1 = itemsCount > 1
      ? `${params.storeName} - ${itemsCount} items`
      : params.items[0].productName;
    const r2 = params.buyer_email;

    // Generate signature
    const signature = generateFonepaySignature({
      merchantCode: config.merchantCode,
      paymentMode,
      amount,
      currency,
      date,
      paymentReferenceNumber,
      r1,
      r2,
      returnUrl,
      secretKey: config.secretKey,
    });

    // Generate payment URL
    const paymentUrl = generateFonepayPaymentUrl({
      gatewayUrl: config.gatewayUrl,
      merchantCode: config.merchantCode,
      prn: paymentReferenceNumber,
      amount,
      r1,
      r2,
      returnUrl,
      signature,
    });

    // Create HTML page that redirects to FonePay
    const formHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to FonePay...</title>
          <meta http-equiv="refresh" content="0;url=${paymentUrl}">
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
              border: 4px solid rgba(238, 49, 36, 0.3);
              border-radius: 50%;
              border-top: 4px solid #ee3124;
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
            <h2>Redirecting to FonePay Payment Gateway...</h2>
            <p>Please wait while we redirect you to complete your payment</p>
          </div>
          <script>
            window.location.href = "${paymentUrl}";
          </script>
        </body>
      </html>
    `;

    return {
      success: true,
      formHtml,
      transactionUuid: paymentReferenceNumber,
    };
  } catch (error) {
    console.error('Failed to initiate multi-product FonePay payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
}

/**
 * Handle payment failure
 */
export async function handlePaymentFailure(
  transactionUuid?: string
): Promise<void> {
  try {
    console.log('Payment failed for transaction:', transactionUuid);

    // Here you can:
    // 1. Update order status to failed in your database
    // 2. Log the failed transaction
    // 3. Send notification
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Initiate FonePay payment - generates HTML form that auto-submits to FonePay
 */
export async function initiateFonepayPayment(
  params: FonepayPaymentParams
): Promise<InitiatePaymentResult> {
  try {
    const config = getFonepayConfig();
    const paymentReferenceNumber = generatePaymentReferenceNumber();

    // Get current host from headers to preserve subdomain
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Calculate total amount including shipping
    const shippingFee = params.shippingFee || 0;
    const totalAmount = params.amount + shippingFee;

    // Get product details to find seller
    const product = await getProductById({ id: params.productId });
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    // Store payment metadata for order creation after payment success
    const supabase = createServiceRoleClient();
    const { error: metadataError } = await supabase
      .from('payment_metadata')
      .insert({
        transaction_uuid: paymentReferenceNumber,
        product_id: params.productId,
        seller_id: product.store_id,
        buyer_email: params.buyer_email,
        buyer_name: params.buyer_name,
        shipping_address: params.shipping_address,
        amount: totalAmount,
        quantity: params.quantity,
        payment_method: 'FonePay',
        shipping_option: params.shippingOption || null,
        buyer_notes: params.buyer_notes || null,
      });

    if (metadataError) {
      console.error('Error storing payment metadata:', metadataError);
      return {
        success: false,
        error: 'Failed to initialize payment',
      };
    }

    // FonePay parameters
    const amount = totalAmount.toFixed(2);
    const currency = 'NPR';
    const paymentMode = 'P'; // P = Payment
    const date = getFonepayDate(); // MM/DD/YYYY format
    const returnUrl = `${baseUrl}/payment/success`;
    const r1 = params.productName; // Product/Payment description
    const r2 = params.buyer_email; // Additional info

    // Generate HMAC-SHA512 signature
    const signature = generateFonepaySignature({
      merchantCode: config.merchantCode,
      paymentMode,
      amount,
      currency,
      date,
      paymentReferenceNumber,
      r1,
      r2,
      returnUrl,
      secretKey: config.secretKey,
    });

    // Generate payment URL with query parameters (FonePay uses GET, not POST)
    const paymentUrl = generateFonepayPaymentUrl({
      gatewayUrl: config.gatewayUrl,
      merchantCode: config.merchantCode,
      prn: paymentReferenceNumber,
      amount,
      r1,
      r2,
      returnUrl,
      signature,
    });


    // Create HTML page that redirects to FonePay (using GET request via URL)
    const formHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to FonePay...</title>
          <meta http-equiv="refresh" content="0;url=${paymentUrl}">
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
              border: 4px solid rgba(238, 49, 36, 0.3);
              border-radius: 50%;
              border-top: 4px solid #ee3124;
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
            <h2>Redirecting to FonePay Payment Gateway...</h2>
            <p>Please wait while we redirect you to complete your payment</p>
          </div>
          <script>
            window.location.href = "${paymentUrl}";
          </script>
        </body>
      </html>
    `;

    return {
      success: true,
      formHtml,
      transactionUuid: paymentReferenceNumber,
    };
  } catch (error) {
    console.error('Failed to initiate FonePay payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to initiate payment',
    };
  }
}

/**
 * Verify FonePay payment response
 */
export async function verifyFonepayPayment(
  paymentReferenceNumber: string,
  amount: string,
  receivedSignature: string,
  uid: string = ''
): Promise<VerifyPaymentResult> {
  try {
    const config = getFonepayConfig();

    // Verify signature
    const isValid = verifyFonepayResponse(receivedSignature, {
      merchantCode: config.merchantCode,
      paymentReferenceNumber,
      amount,
      uid,
      secretKey: config.secretKey,
    });

    if (!isValid) {
      console.error('FonePay payment signature verification failed');
      return {
        success: false,
        error: 'Invalid payment signature',
      };
    }

    // Retrieve payment metadata for order creation later
    const supabase = createServiceRoleClient();
    const { data: metadata, error: metadataFetchError } = await supabase
      .from('payment_metadata')
      .select('*')
      .eq('transaction_uuid', paymentReferenceNumber)
      .single();

    if (metadataFetchError || !metadata) {
      console.error('Error fetching payment metadata:', metadataFetchError);
      return {
        success: false,
        error: 'Payment verified but metadata not found',
      };
    }

    // Store transaction code in metadata for order creation
    await supabase
      .from('payment_metadata')
      .update({ transaction_code: paymentReferenceNumber })
      .eq('transaction_uuid', paymentReferenceNumber);

    console.log('FonePay payment verified successfully!');

    return {
      success: true,
      data: {
        transactionCode: paymentReferenceNumber,
        amount: amount,
        status: 'COMPLETE',
        transactionUuid: paymentReferenceNumber,
        metadata: {
          seller_id: metadata.seller_id,
          product_id: metadata.product_id,
          quantity: metadata.quantity || 1,
          buyer_email: metadata.buyer_email,
          buyer_name: metadata.buyer_name,
          shipping_address: metadata.shipping_address,
          is_processed: metadata.is_processed,
        },
      },
    };
  } catch (error) {
    console.error('Failed to verify FonePay payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}
