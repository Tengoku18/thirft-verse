'use server';

import { sendProductNotReceivedEmail } from '@/lib/email/send';
import { sendPushNotification } from '@/lib/expo-push';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateOrderCodeWithDate } from '@/lib/utils/order-code';
import {
  Order,
  OrderWithDetails,
  PaginatedResponse,
  ShippingAddress,
} from '@/types/database';
import { getSellerOrderUrl } from '@/utils/orderHelpers';
import { decrementProductAvailability } from './products';

interface CreateOrderParams {
  seller_id: string;
  product_id: string;
  quantity: number;
  buyer_email: string;
  buyer_name: string;
  shipping_address: ShippingAddress;
  transaction_code?: string | null;
  transaction_uuid?: string | null;
  amount: number;
  shipping_fee?: number;
  shipping_option?: 'home' | 'branch' | null;
  payment_method?: string;
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
  buyer_notes?: string | null;
}

interface GetOrdersParams {
  seller_id?: string;
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
  limit?: number;
  offset?: number;
}

/**
 * Create a new order after successful payment
 */
export async function createOrder(
  params: CreateOrderParams
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    // Generate unique order code - use transaction_uuid if available, otherwise generate random string
    const orderCodeSeed = params.transaction_uuid || `cod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const orderCode = generateOrderCodeWithDate(orderCodeSeed);

    // Calculate product cost (amount - shipping_fee)
    const shippingFee = params.shipping_fee || 0;
    const productCost = params.amount - shippingFee;
    const paymentMethod = params.payment_method || 'eSewa';

    // Calculate seller's earning (always 95% of product cost)
    const sellersEarning = Math.round(productCost * 0.95);

    // Calculate platform earnings based on payment method
    // eSewa: 3% platform fee, COD: 5% platform fee
    const platformFeeRate = paymentMethod === 'eSewa' ? 0.03 : 0.05;
    const platformEarnings = Math.round(productCost * platformFeeRate * 100) / 100;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        seller_id: params.seller_id,
        product_id: params.product_id,
        quantity: params.quantity,
        buyer_email: params.buyer_email,
        buyer_name: params.buyer_name,
        shipping_address: params.shipping_address,
        transaction_code: params.transaction_code || null,
        transaction_uuid: params.transaction_uuid || null,
        amount: params.amount,
        shipping_fee: shippingFee,
        shipping_option: params.shipping_option || null,
        payment_method: paymentMethod,
        status: params.status || 'pending',
        order_code: orderCode,
        sellers_earning: sellersEarning,
        platform_earnings: platformEarnings,
        buyer_notes: params.buyer_notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Decrement product availability after successful order creation
    const inventoryResult = await decrementProductAvailability(
      params.product_id,
      params.quantity
    );

    if (!inventoryResult.success) {
      console.error('Failed to update inventory:', inventoryResult.error);
    }

    // Send push notification to seller (non-blocking)
    try {
      const [{ data: seller }, { data: product }] = await Promise.all([
        supabase
          .from('profiles')
          .select('expo_push_tokens, config')
          .eq('id', params.seller_id)
          .single(),
        supabase
          .from('products')
          .select('title')
          .eq('id', params.product_id)
          .single(),
      ]);

      const productName = product?.title || 'Unknown product';
      const notifTitle = 'New Order Received';
      const notifBody = `"${productName}" - Rs.${params.amount} (Order #${orderCode})`;

      // Send push notification if not muted
      if (!seller?.config?.notifications_muted) {
        const tokens: string[] = seller?.expo_push_tokens ?? [];
        if (tokens.length > 0) {
          await sendPushNotification({
            to: tokens,
            title: notifTitle,
            body: notifBody,
            data: {
              order_id: data.id,
              status: 'pending',
              product_title: productName,
              amount: String(params.amount),
            },
          });
          console.log('New order notification sent to seller:', params.seller_id);
        }
      }

      // Insert in-app notification (always, regardless of mute)
      await supabase.from('notifications').insert({
        user_id: params.seller_id,
        title: notifTitle,
        body: notifBody,
        type: 'new_order',
        data: {
          order_id: data.id,
          status: 'pending',
          product_title: productName,
          amount: String(params.amount),
        },
      });
    } catch (notifError) {
      // Don't fail order creation if notification fails
      console.error('Failed to send new order notification:', notifError);
    }

    return {
      success: true,
      order: data,
    };
  } catch (error) {
    console.error('Failed to create order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}

/**
 * Get orders with optional filtering
 */
export async function getOrders(
  params?: GetOrdersParams
): Promise<PaginatedResponse<OrderWithDetails>> {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        seller:profiles!seller_id(id, name, store_username),
        product:products(id, title, cover_image, price)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    if (params?.seller_id) {
      query = query.eq('seller_id', params.seller_id);
    }

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
      console.error('Error fetching orders:', error);
      throw new Error(error.message);
    }

    return { data: data || [], count };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithDetails | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        seller:profiles!seller_id(id, name, store_username),
        product:products(id, title, cover_image, price)
      `
      )
      .eq('id', orderId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch order by ID:', error);
    return null;
  }
}

/**
 * Get order by transaction UUID
 */
export async function getOrderByTransactionUuid(
  transactionUuid: string
): Promise<Order | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('transaction_uuid', transactionUuid)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order by transaction UUID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch order by transaction UUID:', error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    };
  }
}

/**
 * Report product not received - sends emergency alert email to seller
 */
export async function reportProductNotReceived(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();

    // Get order details with seller and product information
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        *,
        seller:profiles!seller_id(id, name, store_username, currency),
        product:products(id, title, cover_image, price)
      `
      )
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return {
        success: false,
        error: 'Order not found',
      };
    }

    // Get seller email from auth.users
    const { data: authUser, error: authError } =
      await supabase.auth.admin.getUserById(order.seller_id);

    if (authError || !authUser?.user?.email) {
      console.error('Error fetching seller email:', authError);
      return {
        success: false,
        error: 'Seller email not found',
      };
    }

    const sellerEmail = authUser.user.email;

    // Send the emergency alert email to the seller
    const emailResult = await sendProductNotReceivedEmail({
      to: sellerEmail,
      sellerName:
        order.seller?.name || order.seller?.store_username || 'Seller',
      orderCode: order.order_code || order.id,
      orderDate: new Date(order.created_at).toLocaleDateString(),
      orderDetailsUrl: getSellerOrderUrl(order.id),
    });

    if (!emailResult.success) {
      console.error(
        'Error sending product not received email:',
        emailResult.error
      );
      return {
        success: false,
        error: 'Failed to send alert email',
      };
    }

    console.log(
      'Product not received alert sent successfully for order:',
      orderId
    );

    return { success: true };
  } catch (error) {
    console.error('Failed to report product not received:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send alert',
    };
  }
}
