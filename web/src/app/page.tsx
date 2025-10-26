import ProductCard from '@/_components/ProductCard';
import UserNotFound from '@/_components/UserNotFound';
import LandingPage from '@/_components/landing/LandingPage';
import {
  getProductsByCreatorId,
  getUserById,
  getUserIdByInstagramHandle,
} from '@/lib/dummyData';
import { getSubDomain } from '@/utils/domainHelpers';
import { pluralize } from '@/utils/textHelpers';
import { Store } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Parse hostname and subdomain
  const hostname = host.split(':')[0]; // Remove port if present
  const subdomain = getSubDomain(hostname);

  if (subdomain === process.env.NEXT_PUBLIC_DOMAINNAME || subdomain === 'www' || subdomain === '') {
    return <LandingPage />;
  }

  // Step 1: Get user ID from Instagram handle (subdomain)
  const userId = await getUserIdByInstagramHandle(subdomain);

  if (!userId) {
    return <UserNotFound instagramHandle={subdomain || 'unknown'} />;
  }

  // Step 2: Fetch user data and products in parallel
  const [user, { data: products, count }] = await Promise.all([
    getUserById(userId),
    getProductsByCreatorId(userId),
  ]);

  // User found - Display profile
  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header Section */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Profile Photo */}
            <div className="shrink-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-secondary/20 bg-background sm:h-40 sm:w-40">
                {user?.image_url ? (
                  <Image
                    src={user.image_url}
                    alt={user.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, 160px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent-2 to-secondary">
                    <span className="font-heading text-4xl font-bold text-surface">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-heading mb-2 text-2xl font-bold text-primary sm:text-3xl">
                {user?.name}
              </h1>

              <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-primary/70 sm:justify-start">
                <div>
                  <span className="font-semibold text-primary">
                    {count || 0}
                  </span>{' '}
                  {pluralize(count || 0, 'product')}
                </div>
                {user?.instagram_handle && (
                  <div className="flex items-center gap-1.5">
                    <Store className="h-4 w-4" />
                    @{user.instagram_handle}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="font-heading mb-6 text-xl font-bold text-primary">
          Products
        </h2>

        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-primary/60">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={user?.currency}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
