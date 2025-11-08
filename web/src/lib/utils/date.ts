/**
 * Date utility functions
 */

/**
 * Check if a given number of days have passed since a specific date
 * @param dateString - The date to check against (ISO string or any valid date string)
 * @param days - Number of days that should have passed
 * @returns true if the specified number of days have passed, false otherwise
 */
export function hasDaysPassed(dateString: string, days: number): boolean {
  try {
    const targetDate = new Date(dateString)
    const currentDate = new Date()

    // Calculate the difference in milliseconds
    const diffInMs = currentDate.getTime() - targetDate.getTime()

    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    return diffInDays >= days
  } catch (error) {
    console.error('Error checking days passed:', error)
    return false
  }
}

/**
 * Get the number of days that have passed since a specific date
 * @param dateString - The date to check against (ISO string or any valid date string)
 * @returns number of days that have passed (rounded down)
 */
export function getDaysPassed(dateString: string): number {
  try {
    const targetDate = new Date(dateString)
    const currentDate = new Date()

    // Calculate the difference in milliseconds
    const diffInMs = currentDate.getTime() - targetDate.getTime()

    // Convert milliseconds to days and round down
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    return diffInDays
  } catch (error) {
    console.error('Error calculating days passed:', error)
    return 0
  }
}
