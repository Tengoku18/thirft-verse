/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Color palette inspired by vintage thrift stores with warm, earthy tones.
 */

import { Platform } from 'react-native';

// Thriftverse Color Palette
const primary = '#3B2F2F'; // Rich espresso brown
const secondary = '#D4A373'; // Warm tan
const background = '#FAF7F2'; // Soft off-white
const surface = '#FFFFFF'; // Clean white
const border = '#C7BFB3'; // Subtle neutral
const accent1 = '#6B705C'; // Muted olive
const accent2 = '#CB997E'; // Clay blush

const tintColorLight = secondary; // Warm tan for light mode
const tintColorDark = accent2; // Clay blush for dark mode

export const Colors = {
  light: {
    text: primary, // Rich espresso brown text
    background: background, // Soft off-white background
    tint: tintColorLight,
    icon: accent1, // Muted olive icons
    tabIconDefault: border, // Subtle neutral for inactive tabs
    tabIconSelected: secondary, // Warm tan for active tabs
  },
  dark: {
    text: background, // Light text on dark background
    background: primary, // Rich espresso brown background
    tint: tintColorDark,
    icon: accent2, // Clay blush icons
    tabIconDefault: border, // Subtle neutral for inactive tabs
    tabIconSelected: accent2, // Clay blush for active tabs
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
