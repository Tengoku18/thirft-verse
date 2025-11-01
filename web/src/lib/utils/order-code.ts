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
 * Alternative: Generate order code with timestamp component
 * Format: TV-YYMMDD-XXX
 * Example: TV-251101-A4K
 */
export function generateOrderCodeWithDate(transactionUuid: string): string {
  const now = new Date()
  const year = now.getFullYear().toString().substring(2) // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')

  // Take first 6 characters of transaction UUID and convert to base36
  const hash = transactionUuid.replace(/-/g, '').substring(0, 6)
  const num = parseInt(hash, 16)
  const code = num.toString(36).toUpperCase().substring(0, 3).padStart(3, '0')

  return `TV-${year}${month}${day}-${code}`
}
