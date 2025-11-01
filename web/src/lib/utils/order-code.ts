/**
 * Generate a unique order code based on transaction UUID
 * Format: TV-XXXXXX (6 alphanumeric characters)
 * Example: TV-A4K2M9
 */
export function generateOrderCode(transactionUuid: string): string {
  // Take first 8 characters of transaction UUID and convert to base36
  const hash = transactionUuid.replace(/-/g, '').substring(0, 8)
  const num = parseInt(hash, 16)

  // Convert to base36 (0-9, A-Z) and take first 6 characters
  const code = num.toString(36).toUpperCase().substring(0, 6).padStart(6, '0')

  return `TV-${code}`
}

/**
 * Generate order code with timestamp and UUID hash component
 * Format: #TV-YYMMDD-HHMMSS-XXX
 * Example: #TV-251102-143052-A4K
 * This provides much higher uniqueness by including time of day
 */
export function generateOrderCodeWithDate(transactionUuid: string): string {
  const now = new Date()
  const year = now.getFullYear().toString().substring(2) // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  // Generate a hash from the transaction UUID
  // Use a simple hash function to ensure we get a valid number
  let hash = 0
  for (let i = 0; i < transactionUuid.length; i++) {
    const char = transactionUuid.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to positive number and then to base36 for the code
  // Use 4 characters for better uniqueness (36^4 = 1,679,616 combinations)
  const positiveHash = Math.abs(hash)
  const code = positiveHash.toString(36).toUpperCase().substring(0, 4).padStart(4, '0')

  return `#TV-${year}${month}${day}-${hours}${minutes}${seconds}-${code}`
}
