import ProductCard from '@/_components/ProductCard'
import UserNotFound from '@/_components/UserNotFound'
import LandingPage from '@/_components/landing/LandingPage'
import {
  getProductsByStoreId,
  getProfileByStoreUsername,
} from '@/actions'
import { getSubDomain } from '@/utils/domainHelpers'
import { pluralize } from '@/utils/textHelpers'
import { Compass, Store } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  // Parse hostname and subdomain
  const hostname = host.split(':')[0] // Remove port if present
  const subdomain = getSubDomain(hostname)

  // Show landing page for main domain
  if (subdomain === process.env.NEXT_PUBLIC_DOMAINNAME || subdomain === 'www' || subdomain === '') {
    return <LandingPage />
  }

  // Step 1: Get profile by store_username (subdomain)
  const profile = await getProfileByStoreUsername({ storeUsername: subdomain })

  if (!profile) {
    return <UserNotFound instagramHandle={subdomain || 'unknown'} />
  }

  // Step 2: Fetch products for this store
  const { data: products, count } = await getProductsByStoreId(profile.id, {
    status: 'available',
  })

  // Profile found - Display profile
  return (
    <div className="min-h-screen bg-background">
      {/* Explore Notification Bar */}
      <div className="border-b border-border/30 bg-linear-to-r from-secondary/20 via-accent-2/15 to-secondary/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 text-secondary" />
            <p className="text-sm font-medium text-primary sm:text-base">
              Discover more amazing thrift stores and unique finds
            </p>
          </div>
          <Link
            href="/explore"
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface shadow-md transition-all hover:scale-105 hover:shadow-lg sm:px-6"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Profile Header Section with Beautiful Gradient */}
      <div className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-secondary/10 via-accent-2/5 to-background shadow-sm">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-accent-1/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-linear-to-tr from-secondary/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Profile Photo with Enhanced Style */}
            <div className="shrink-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/50 bg-background shadow-xl ring-4 ring-secondary/10 transition-transform duration-300 hover:scale-105 sm:h-40 sm:w-40">
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
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent-2 to-secondary">
                    <span className="font-heading text-4xl font-bold text-surface sm:text-5xl">
                      {profile?.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-heading mb-3 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {profile?.name}
              </h1>

              <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-primary/70 sm:justify-start sm:text-base">
                <div className="rounded-full bg-background/60 px-4 py-1.5 backdrop-blur-sm">
                  <span className="font-semibold text-primary">
                    {count || 0}
                  </span>{' '}
                  {pluralize(count || 0, 'product')}
                </div>
                {profile?.store_username && (
                  <div className="flex items-center gap-1.5 rounded-full bg-background/60 px-4 py-1.5 backdrop-blur-sm">
                    <Store className="h-4 w-4" />
                    @{profile.store_username}
                  </div>
                )}
              </div>

              {profile?.bio && (
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-primary/80 sm:mx-0 sm:text-base">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="font-heading mb-8 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Products
        </h2>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-linear-to-br from-secondary/5 to-accent-2/5 py-16 text-center">
            <p className="text-base text-primary/60 sm:text-lg">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
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
  )
}
