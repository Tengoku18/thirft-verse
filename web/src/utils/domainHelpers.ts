export function getSubDomain(hostname: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Split by ".localhost" and return the first subdomain
    const parts = hostname.split('.localhost');
    return parts[0] || '';
  } else if (hostname.endsWith('.vercel.app')) {
    // Vercel: split by ".vercel.app" and return the subdomain
    const parts = hostname.split('.dev-thriftverse.vercel.app');
    return parts[0] || '';
  } else {
    // Production: split by environment variable
    const productionDomain =
      process.env.NEXT_PUBLIC_DOMAIN || '.thriftverse.shop';
    const parts = hostname.split(productionDomain);
    return parts[0] || '';
  }
}

/**
 * Generates a storefront URL from a store username based on the environment
 * @param storeUsername - The username of the store
 * @returns The complete storefront URL
 */
export function getStorefrontUrl(storeUsername: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const domainName = process.env.NEXT_PUBLIC_DOMAINNAME || 'localhost';

  if (isDevelopment) {
    // Development: use localhost with port 3000
    return `http://${storeUsername}.${domainName}:3000`;
  } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    // Production: use thriftverse.shop
    return `https://${storeUsername}.thriftverse.shop`;
  } else {
    // Vercel preview/staging
    return `https://${storeUsername}.thriftverse.vercel.app`;
  }
}

/**
 * Gets the base domain for the current environment
 * @returns The base domain (e.g., 'localhost:3000', 'thriftverse.shop')
 */
export function getBaseDomain(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const domainName = process.env.NEXT_PUBLIC_DOMAINNAME || 'localhost';

  if (isDevelopment) {
    return `${domainName}:3000`;
  } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'thriftverse.shop';
  } else {
    return 'dev-thriftverse.vercel.app';
  }
}
