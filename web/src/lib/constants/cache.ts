/**
 * Cache Configuration Reference
 *
 * Documentation for Next.js ISR (Incremental Static Regeneration) revalidation
 * times used across the application.
 *
 * IMPORTANT: Next.js requires `revalidate` exports to be literal number values,
 * not imported constants. This file serves as documentation and reference.
 * When updating revalidation times, update both this file AND the page files.
 *
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 *
 * Current Configuration:
 * ----------------------
 * | Page Type      | Value | Files                                    |
 * |----------------|-------|------------------------------------------|
 * | Listing pages  | 60s   | /explore/page.tsx, /page.tsx             |
 * | Product pages  | 30s   | /product/[id]/page.tsx                   |
 * | Static pages   | 3600s | /faqs, /terms, /privacy, etc.            |
 */

/** Listing pages: 60 seconds */
export const REVALIDATE_LISTING = 60

/** Product detail pages: 30 seconds */
export const REVALIDATE_PRODUCT = 30

/** Store/profile pages: 60 seconds */
export const REVALIDATE_STORE = 60

/** Static content pages: 1 hour */
export const REVALIDATE_STATIC = 3600
