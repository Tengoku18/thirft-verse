import { getProfiles } from '@/actions'
import { getAvailableProducts } from '@/actions/products'
import ExploreContent from '@/_components/explore/ExploreContent'

/**
 * ISR Configuration
 * Revalidate this page every 60 seconds to ensure fresh product listings
 * while maintaining good performance through edge caching.
 * @see /src/lib/constants/cache.ts for documentation
 */
export const revalidate = 60

export default async function ExplorePage() {
  // Fetch all available products and stores in parallel
  const [productsResult, profilesResult] = await Promise.all([
    getAvailableProducts(),
    getProfiles({ role: 'USER' })
  ])

  const products = productsResult.data
  const stores = profilesResult.data

  return <ExploreContent initialProducts={products} initialStores={stores} />
}
