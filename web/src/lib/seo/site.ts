// Single source of truth for site-wide SEO constants.
// Every schema builder, sitemap, robots, and metadata file pulls from here so
// updating the brand or canonical URL is a one-line change.

export const SITE_URL = 'https://www.thriftverse.shop'
export const SITE_NAME = 'Thriftverse'
export const SITE_LOGO = `${SITE_URL}/images/horizontal-logo.png`
export const SITE_OG_IMAGE = `${SITE_URL}/images/cover-image.png`

export const SITE_DESCRIPTION =
  'Independent online thrift marketplace for preloved fashion and sustainable secondhand shopping.'

export const SITE_KEYWORDS = [
  // Generic — broad reach, low ranking odds, but cheap to include
  'thrift',
  'thrifting',
  'thrift store',
  'online thrift',
  'preloved fashion',
  'secondhand shopping',
  'vintage clothing',
  'sustainable fashion',
  'Thriftverse',
  // Nepal-specific — long-tail terms we can realistically rank for
  'thrift store nepal',
  'thrift shop nepal',
  'thrifting nepal',
  'online thrift nepal',
  'online thrift store nepal',
  'preloved fashion nepal',
  'secondhand clothes nepal',
  'vintage clothing nepal',
  'sustainable fashion nepal',
  'online shopping nepal',
  'shop in nepal',
  // City-level — Kathmandu is the biggest commerce hub
  'thrift kathmandu',
  'thrift store kathmandu',
  'preloved kathmandu',
  'secondhand kathmandu',
] as const
