/**
 * Logo asset paths for the ThriftVerse application
 */

// Mobile app logo paths (relative to assets directory)
export const LOGOS = {
  // Main logo variations
  horizontal: require('../assets/logo/horizontal-logo.png'),
  vertical: require('../assets/logo/vertical-logo.png'),
  icon: require('../assets/logo/fav-icon.png'),
  text: require('../assets/logo/text-logo.png'),

  // Social media OG image
  og: require('../assets/logo/og.png'),

  // Note: logo.PNG with uppercase extension causes Metro bundler issues
  // Available in web directory if needed: /images/logo.PNG
} as const;

// Web/URL paths for logos (for web components and external references)
export const LOGO_URLS = {
  horizontal: '/images/horizontal-logo.png',
  vertical: '/images/vertical-logo.png',
  icon: '/images/fav-icon.png',
  og: '/images/og.png',

  // Full URLs (for emails and external sharing)
  full: {
    horizontal: 'https://www.thriftverse.shop/images/horizontal-logo.png',
    vertical: 'https://www.thriftverse.shop/images/vertical-logo.png',
    icon: 'https://www.thriftverse.shop/images/fav-icon.png',
    og: 'https://www.thriftverse.shop/images/og.png',
  },
} as const;

// Logo usage guidelines
export const LOGO_USAGE = {
  // Use horizontal logo in headers, navbars, and wide layouts
  header: LOGOS.horizontal,

  // Use vertical logo in splash screens, emails, and tall layouts
  splash: LOGOS.vertical,

  // Use icon for app icons, favicons, and small spaces
  appIcon: LOGOS.icon,

  // Use OG image for social media sharing
  socialMedia: LOGOS.og,
} as const;

export type LogoType = keyof typeof LOGOS;
export type LogoUrl = keyof typeof LOGO_URLS;
