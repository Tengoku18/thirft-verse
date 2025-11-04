'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import {
  Order,
  OrderWithDetails,
  PaginatedResponse,
  ShippingAddress,
} from '@/types/database'
import { generateOrderCodeWithDate } from '@/lib/utils/order-code'
import { decrementProductAvailability } from './products'

interface CreateOrderParams {
  seller_id: string
  product_id: string
  quantity: number
  buyer_email: string
  buyer_name: string
  shipping_address: ShippingAddress
  transaction_code: string
  transaction_uuid: string
  amount: number
  payment_method?: string
}

interface GetOrdersParams {
  seller_id?: string
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
  limit?: number
  offset?: number
}

/**
 * Create a new order after successful payment
 */
export async function createOrder(
  params: CreateOrderParams
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const supabase = createServiceRoleClient()

    // Generate unique order code from transaction UUID with date component
    const orderCode = generateOrderCodeWithDate(params.transaction_uuid)

    const { data, error } = await supabase
      .from('orders')
      .insert({
        seller_id: params.seller_id,
        product_id: params.product_id,
        quantity: params.quantity,
        buyer_email: params.buyer_email,
        buyer_name: params.buyer_name,
        shipping_address: params.shipping_address,
        transaction_code: params.transaction_code,
        transaction_uuid: params.transaction_uuid,
        amount: params.amount,
        payment_method: params.payment_method || 'eSewa',
        status: 'completed',
        order_code: orderCode,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log('Order created successfully:', data.id)

    // Decrement product availability after successful order creation
    const inventoryResult = await decrementProductAvailability(
      params.product_id,
      params.quantity
    )

    if (!inventoryResult.success) {
      console.error('Failed to update inventory:', inventoryResult.error)
      // Don't fail the order creation if inventory update fails
      // The order is already created and payment is done
      // Log it for manual intervention if needed
    }

    return {
      success: true,
      order: data,
    }
  } catch (error) {
    console.error('Failed to create order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    }
  }
}

/**
 * Get orders with optional filtering
 */
export async function getOrders(
  params?: GetOrdersParams
): Promise<PaginatedResponse<OrderWithDetails>> {
  try {
    const supabase = createServiceRoleClient()

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
      .order('created_at', { ascending: false })

    if (params?.seller_id) {
      query = query.eq('seller_id', params.seller_id)
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    if (params?.offset) {
      const rangeEnd = params.offset + (params.limit || 10) - 1
      query = query.range(params.offset, rangeEnd)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      throw new Error(error.message)
    }

    return { data: data || [], count }
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    throw error
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(
  orderId: string
): Promise<OrderWithDetails | null> {
  try {
    const supabase = createServiceRoleClient()

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
      .maybeSingle()

    if (error) {
      console.error('Error fetching order by ID:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch order by ID:', error)
    return null
  }
}

/**
 * Get order by transaction UUID
 */
export async function getOrderByTransactionUuid(
  transactionUuid: string
): Promise<Order | null> {
  try {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('transaction_uuid', transactionUuid)
      .maybeSingle()

    if (error) {
      console.error('Error fetching order by transaction UUID:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch order by transaction UUID:', error)
    return null
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
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to update order status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    }
  }
}
