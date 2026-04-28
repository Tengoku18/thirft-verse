import { getAvailableProducts } from '@/actions/products'
import { getProfiles } from '@/actions/profiles'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.thriftverse.shop'
const MAX_PRODUCTS = 5000
const MAX_STORES = 5000

// Cache the sitemap for 1 hour. Crawlers re-fetch periodically;
// no need to hit the DB on every request.
export const revalidate = 3600

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: `${SITE_URL}/explore`,
    changeFrequency: 'hourly',
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/home`,
    changeFrequency: 'weekly',
    priority: 0.6,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [...STATIC_ROUTES]

  // Products and stores are fetched in parallel and each is wrapped in its own
  // try/catch so a failure in one branch doesn't break the entire sitemap.
  const [productsResult, storesResult] = await Promise.allSettled([
    safeFetchProducts(),
    safeFetchStores(),
  ])

  if (productsResult.status === 'fulfilled') {
    entries.push(...productsResult.value)
  } else {
    console.error('Sitemap: failed to fetch products', productsResult.reason)
  }

  if (storesResult.status === 'fulfilled') {
    entries.push(...storesResult.value)
  } else {
    console.error('Sitemap: failed to fetch stores', storesResult.reason)
  }

  return entries
}

async function safeFetchProducts(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await getAvailableProducts({ limit: MAX_PRODUCTS })
    return data.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : undefined,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Sitemap product fetch failed', error)
    return []
  }
}

async function safeFetchStores(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await getProfiles({
      role: 'USER',
      verified: true,
      limit: MAX_STORES,
    })
    return data
      .filter((profile) => profile.store_username)
      .map((profile) => ({
        url: getStorefrontUrl(profile.store_username),
        lastModified: profile.updated_at
          ? new Date(profile.updated_at)
          : undefined,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
  } catch (error) {
    console.error('Sitemap store fetch failed', error)
    return []
  }
}
