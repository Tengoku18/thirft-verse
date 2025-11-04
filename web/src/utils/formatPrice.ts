/**
 * Currency configuration with symbols
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  NPR: 'NPR',
  INR: '₹',
  Rs: 'Rs.',
}

/**
 * Format a price with proper currency symbol and decimal places
 * @param price - The price to format (number or string)
 * @param currency - The currency code (e.g., 'USD', 'NPR', 'INR')
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string,
  currency: string = 'USD',
  options: {
    showDecimals?: boolean
    symbolPosition?: 'before' | 'after'
    spaceAfterSymbol?: boolean
  } = {}
): string {
  const {
    showDecimals = true,
    symbolPosition = 'before',
    spaceAfterSymbol = true,
  } = options

  // Convert to number if string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  // Handle invalid numbers
  if (isNaN(numericPrice)) {
    return '0.00'
  }

  // Format the number with comma separators and decimals
  const formattedNumber = numericPrice.toLocaleString('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  // Get currency symbol (fallback to currency code if not in map)
  const symbol = CURRENCY_SYMBOLS[currency] || currency

  // Build the formatted string
  const space = spaceAfterSymbol ? ' ' : ''

  if (symbolPosition === 'after') {
    return `${formattedNumber}${space}${symbol}`
  }

  return `${symbol}${space}${formattedNumber}`
}

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns The currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || currency
}

/**
 * Format price for display in product cards and listings
 * @param price - The price to format
 * @param currency - The currency code
 * @param showDecimals - Whether to show decimal places (default: false for product prices)
 * @returns Formatted price string
 */
export function formatProductPrice(
  price: number | string,
  currency: string = 'USD',
  showDecimals: boolean = false
): string {
  return formatPrice(price, currency, { showDecimals })
}

/**
 * Format price for checkout and payment flows
 * @param price - The price to format
 * @param currency - The currency code
 * @returns Formatted price string without decimal places
 */
export function formatCheckoutPrice(
  price: number | string,
  currency: string = 'USD'
): string {
  return formatPrice(price, currency, { showDecimals: false })
}
