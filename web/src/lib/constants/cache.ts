/**
 * Cache Configuration Constants
 *
 * Centralized configuration for Next.js ISR (Incremental Static Regeneration)
 * revalidation times. This allows for consistent cache behavior across the
 * application and easy adjustments in one place.
 *
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 */

/**
 * Revalidation time in seconds for listing pages (explore, store pages).
 * These pages show multiple products and benefit from frequent updates
 * while still maintaining good performance through caching.
 *
 * Default: 60 seconds (1 minute)
 */
export const REVALIDATE_LISTING = 60

/**
 * Revalidation time in seconds for product detail pages.
 * Product details (price, availability) need relatively fresh data
 * to avoid displaying sold-out items as available.
 *
 * Default: 30 seconds
 */
export const REVALIDATE_PRODUCT = 30

/**
 * Revalidation time in seconds for store/profile pages.
 * Store information changes less frequently than product listings.
 *
 * Default: 60 seconds (1 minute)
 */
export const REVALIDATE_STORE = 60

/**
 * Revalidation time in seconds for static content pages
 * (FAQs, Terms, Privacy Policy, etc.)
 *
 * Default: 3600 seconds (1 hour)
 */
export const REVALIDATE_STATIC = 3600
