import { getProfiles } from '@/actions'
import { getAvailableProducts } from '@/actions/products'
import ExploreContent from '@/_components/explore/ExploreContent'
import { Metadata } from 'next'
import { Suspense } from 'react'

/**
 * ISR Configuration
 * Revalidate this page every 60 seconds to ensure fresh product listings
 * while maintaining good performance through edge caching.
 * @see /src/lib/constants/cache.ts for documentation
 */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Explore Thriftverse — Browse Stores & Products',
  description:
    'Discover thrift stores and one-of-a-kind preloved finds across Thriftverse.',
  openGraph: {
    title: 'Explore Thriftverse — Browse Stores & Products',
    description:
      'Discover thrift stores and one-of-a-kind preloved finds across Thriftverse.',
    url: 'https://www.thriftverse.shop/explore',
    siteName: 'Thriftverse',
    images: [
      {
        url: 'https://www.thriftverse.shop/images/cover-image.png',
        width: 1200,
        height: 630,
        alt: 'Thriftverse',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Thriftverse — Browse Stores & Products',
    description:
      'Discover thrift stores and one-of-a-kind preloved finds across Thriftverse.',
    images: ['https://www.thriftverse.shop/images/cover-image.png'],
  },
}

export default async function ExplorePage() {
  // Fetch all available products and stores in parallel
  const [productsResult, profilesResult] = await Promise.all([
    getAvailableProducts(),
    getProfiles({ role: 'USER', verified: true })
  ])

  const products = productsResult.data
  const stores = profilesResult.data

  return (
    <Suspense>
      <ExploreContent initialProducts={products} initialStores={stores} />
    </Suspense>
  )
}
