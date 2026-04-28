import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.thriftverse.shop'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/explore', '/home', '/product/', '/store/'],
        disallow: [
          '/auth/',
          '/checkout',
          '/checkout/',
          '/order/',
          '/payment/',
          '/api/',
          '/account/',
          '/founder-circle',
          '/_next/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
