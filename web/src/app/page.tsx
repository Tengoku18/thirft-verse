import SectionDivider from '@/_components/store/SectionDivider';
import StoreFooterExplore from '@/_components/store/StoreFooterExplore';
import StoreHero from '@/_components/store/StoreHero';
import StoreProductsBrowser from '@/_components/store/StoreProductsBrowser';
import StoreTrustStrip from '@/_components/store/StoreTrustStrip';
import UserNotFound from '@/_components/UserNotFound';
import LandingPage from '@/_components/landing/LandingPage';
import { getProductsByStoreId, getProfileByStoreUsername } from '@/actions';
import { getSubDomain } from '@/utils/domainHelpers';
import { Metadata } from 'next';
import { headers } from 'next/headers';

/**
 * ISR Configuration
 * Revalidate store pages every 60 seconds to show fresh product listings
 * while maintaining good performance through edge caching.
 * @see /src/lib/constants/cache.ts for documentation
 */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0];
  const subdomain = getSubDomain(hostname);

  // Return default metadata for main domain
  if (
    subdomain === process.env.NEXT_PUBLIC_DOMAINNAME ||
    subdomain === 'www' ||
    subdomain === ''
  ) {
    return {
      title: 'Thriftverse — Your Finds. Your Store. Your Story.',
      description:
        'Create your own thrift store and give every item a second life.',
    };
  }

  // Fetch store profile for subdomain
  const profile = await getProfileByStoreUsername({ storeUsername: subdomain });

  if (!profile) {
    return {
      title: 'Store Not Found | Thriftverse',
      description: 'This store does not exist.',
    };
  }

  const storeUrl = `https://${subdomain}.thriftverse.shop`;
  const title = `${profile.name} | Thriftverse`;
  const description =
    profile.bio ||
    `Shop unique thrift finds at ${profile.name}'s store on Thriftverse.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: storeUrl,
      siteName: 'Thriftverse',
      images: profile.profile_image
        ? [
            {
              url: profile.profile_image,
              width: 800,
              height: 800,
              alt: profile.name,
            },
          ]
        : [
            {
              url: 'https://www.thriftverse.shop/images/horizontal-logo.png',
              width: 1200,
              height: 630,
              alt: 'Thriftverse',
            },
          ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.profile_image
        ? [profile.profile_image]
        : ['https://www.thriftverse.shop/images/horizontal-logo.png'],
    },
  };
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Parse hostname and subdomain
  const hostname = host.split(':')[0]; // Remove port if present
  const subdomain = getSubDomain(hostname);

  // Show landing page for main domain
  if (
    subdomain === process.env.NEXT_PUBLIC_DOMAINNAME ||
    subdomain === 'www' ||
    subdomain === ''
  ) {
    return <LandingPage />;
  }

  // Step 1: Get profile by store_username (subdomain)
  const profile = await getProfileByStoreUsername({ storeUsername: subdomain });

  if (!profile) {
    return <UserNotFound instagramHandle={subdomain || 'unknown'} />;
  }

  // Step 2: Fetch products for this store
  const { data: products, count } = await getProductsByStoreId(profile.id, {
    status: 'available',
  });

  // Profile found - Display profile
  return (
    <div className="bg-background min-h-screen">
      <StoreHero profile={profile} productCount={count ?? 0} />
      <SectionDivider />
      <StoreProductsBrowser products={products} currency={profile.currency} />
      <SectionDivider />
      <StoreTrustStrip />
      <SectionDivider spacing="sm" />
      <StoreFooterExplore />
    </div>
  );
}
