export function getSubDomain(hostname: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Split by ".localhost" and return the first subdomain
    const parts = hostname.split('.localhost');
    return parts[0] || '';
  } else if (hostname.endsWith('.vercel.app')) {
    // Vercel: split by ".vercel.app" and return the subdomain
    const parts = hostname.split('.thriftverse.vercel.app');
    return parts[0] || '';
  } else {
    // Production: split by environment variable
    const productionDomain = process.env.NEXT_PUBLIC_DOMAIN || '.thriftverse.shop';
    const parts = hostname.split(productionDomain);
    return parts[0] || '';
  }
}
