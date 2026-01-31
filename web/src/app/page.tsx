import ProductCard from '@/_components/ProductCard';
import UserNotFound from '@/_components/UserNotFound';
import LandingPage from '@/_components/landing/LandingPage';
import { getProductsByStoreId, getProfileByStoreUsername } from '@/actions';
import { getSubDomain } from '@/utils/domainHelpers';
import { pluralize } from '@/utils/textHelpers';
import { Compass, MapPin, Store } from 'lucide-react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

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
      {/* Explore Notification Bar */}
      <div className="border-border/30 from-secondary/20 via-accent-2/15 to-secondary/20 border-b bg-linear-to-r">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Compass className="text-secondary h-5 w-5" />
            <p className="text-primary text-sm font-medium sm:text-base">
              Discover more amazing thrift stores and unique finds
            </p>
          </div>
          <Link
            href="/explore"
            className="bg-primary text-surface shrink-0 rounded-full px-4 py-2 text-sm font-semibold shadow-md transition-all hover:scale-105 hover:shadow-lg sm:px-6"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Profile Header Section with Beautiful Gradient */}
      <div className="border-border/50 from-secondary/10 via-accent-2/5 to-background relative overflow-hidden border-b bg-linear-to-b shadow-sm">
        {/* Decorative gradient orbs */}
        <div className="from-accent-1/20 pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-linear-to-br to-transparent blur-3xl" />
        <div className="from-secondary/20 pointer-events-none absolute bottom-0 -left-10 h-32 w-32 rounded-full bg-linear-to-tr to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Profile Photo with Enhanced Style */}
            <div className="shrink-0">
              <div className="bg-background ring-secondary/10 relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/50 shadow-xl ring-4 transition-transform duration-300 hover:scale-105 sm:h-40 sm:w-40">
                {profile?.profile_image ? (
                  <Image
                    src={profile.profile_image}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, 160px"
                    priority
                  />
                ) : (
                  <div className="from-accent-2 to-secondary flex h-full w-full items-center justify-center bg-linear-to-br">
                    <span className="font-heading text-surface text-4xl font-bold sm:text-5xl">
                      {profile?.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-heading from-primary via-primary/90 to-primary/70 mb-3 bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {profile?.name}
              </h1>

              <div className="text-primary/70 mb-4 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start sm:text-base">
                <div className="bg-background/60 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  <span className="text-primary font-semibold">
                    {count || 0}
                  </span>{' '}
                  {pluralize(count || 0, 'product')}
                </div>
                {profile?.store_username && (
                  <div className="bg-background/60 flex items-center gap-1.5 rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <Store className="h-4 w-4" />@{profile.store_username}
                  </div>
                )}
                {profile?.address && (
                  <div className="bg-background/60 flex items-center gap-1.5 rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <MapPin className="h-4 w-4" />
                    {profile.address}
                  </div>
                )}
              </div>

              {profile?.bio && (
                <p className="text-primary/80 mx-auto max-w-2xl text-sm leading-relaxed sm:mx-0 sm:text-base">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="font-heading from-primary to-primary/70 mb-8 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Products
        </h2>

        {products.length === 0 ? (
          <div className="from-secondary/5 to-accent-2/5 rounded-2xl bg-linear-to-br py-16 text-center">
            <p className="text-primary/60 text-base sm:text-lg">
              No products available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={profile?.currency}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
