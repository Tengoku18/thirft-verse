/**
 * Get the base URL for the application
 * Works in both local and production environments
 */
export function getBaseUrl(): string {
  // In production, use the environment variable or default to thriftverse.shop
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.thriftverse.shop'
  }

  // In development, use localhost
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

/**
 * Generate order details URL for buyers
 * @param orderId - The order ID
 * @returns URL string with buyer view parameter
 */
export function getBuyerOrderUrl(orderId: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/order/${orderId}?view=buyer`
}

/**
 * Generate order details URL for sellers
 * @param orderId - The order ID
 * @returns URL string with seller view parameter
 */
export function getSellerOrderUrl(orderId: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/order/${orderId}?view=seller`
}

/**
 * Generate generic order details URL (no specific view)
 * @param orderId - The order ID
 * @returns URL string without view parameter
 */
export function getOrderUrl(orderId: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/order/${orderId}`
}
