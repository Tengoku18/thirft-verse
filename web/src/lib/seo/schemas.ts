import { Product, ProductWithStore, Profile } from '@/types/database'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME, SITE_URL } from './site'

// All builders return plain JSON-serializable objects shaped for schema.org.
// Pages compose them via <JsonLd data={[...]} /> from _components/seo/JsonLd.

type JsonLdObject = Record<string, unknown>

/**
 * Organization schema — declares the brand entity to Google.
 * Place once at the root layout. `sameAs` should grow as social profiles ship.
 */
export function buildOrganizationSchema(opts?: {
  sameAs?: string[]
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    description: SITE_DESCRIPTION,
    sameAs: opts?.sameAs ?? [],
  }
}

/**
 * WebSite schema with SearchAction — unlocks the sitelinks search box in SERP.
 * The `urlTemplate` must hit a route that accepts `?q=` (we use /explore).
 */
export function buildWebsiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Product schema — drives Google Shopping eligibility and rich product snippets.
 * Pass the canonical product URL (always main domain) plus the resolved store URL.
 */
export function buildProductSchema(
  product: Product | ProductWithStore,
  opts: {
    productUrl: string
    storeUrl?: string
    images?: string[]
    isOutOfStock: boolean
    currency: string
  }
): JsonLdObject {
  const store =
    'store' in product && product.store ? product.store : null
  const images =
    opts.images && opts.images.length > 0
      ? opts.images
      : [product.cover_image].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description:
      product.description ||
      `${product.title} available at ${store?.name || SITE_NAME}.`,
    image: images,
    sku: product.id,
    category: product.category,
    brand: store?.name
      ? {
          '@type': 'Brand',
          name: store.name,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: opts.productUrl,
      priceCurrency: opts.currency,
      price: product.price,
      availability: opts.isOutOfStock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      seller:
        store?.name && opts.storeUrl
          ? {
              '@type': 'Organization',
              name: store.name,
              url: opts.storeUrl,
            }
          : undefined,
    },
  }
}

/**
 * Store schema — each subdomain becomes its own rankable brand entity.
 */
export function buildStoreSchema(profile: Profile): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: profile.name,
    alternateName: profile.store_username
      ? `@${profile.store_username}`
      : undefined,
    url: profile.store_username
      ? getStorefrontUrl(profile.store_username)
      : SITE_URL,
    description:
      profile.bio ||
      `${profile.name} — independent thrift store on ${SITE_NAME} offering curated preloved fashion and secondhand finds.`,
    image: profile.profile_image || undefined,
    parentOrganization: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/**
 * BreadcrumbList — Google replaces the URL in SERPs with the breadcrumb trail.
 * Pass items in order from root to leaf; positions are auto-assigned.
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
