import { getProfiles } from '@/actions'
import { getAvailableProducts } from '@/actions/products'
import ExploreContent from '@/_components/explore/ExploreContent'
import { REVALIDATE_LISTING } from '@/lib/constants/cache'

/**
 * ISR Configuration
 * Revalidate this page periodically to ensure fresh product listings
 * while maintaining good performance through edge caching.
 */
export const revalidate = REVALIDATE_LISTING

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
