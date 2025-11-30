/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Color palette inspired by vintage thrift stores with warm, earthy tones.
 */

import { Platform } from "react-native";

// Thriftverse Color Palette
const primary = "#3B2F2F"; // Rich espresso brown
const secondary = "#D4A373"; // Warm tan
const background = "#FAF7F2"; // Soft off-white
const surface = "#FFFFFF"; // Clean white
const border = "#C7BFB3"; // Subtle neutral
const accent1 = "#6B705C"; // Muted olive
const accent2 = "#CB997E"; // Clay blush

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
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Font family definitions
export const fontFamilies = {
  // Folito - Used for headings
  folito: {
    light: "Folito_300Light",
    regular: "Folito_400Regular",
    medium: "Folito_500Medium",
    semibold: "Folito_600SemiBold",
    bold: "Folito_700Bold",
    extrabold: "Folito_800ExtraBold",
    black: "Folito_900Black",
  },
  // Nunito Sans - Used for body text
  nunitoSans: {
    extralight: "NunitoSans_200ExtraLight",
    light: "NunitoSans_300Light",
    regular: "NunitoSans_400Regular",
    medium: "NunitoSans_500Medium",
    semibold: "NunitoSans_600SemiBold",
    bold: "NunitoSans_700Bold",
    extrabold: "NunitoSans_800ExtraBold",
    black: "NunitoSans_900Black",
  },
};

// Standard font sizes
export const fontSizes = {
  // Heading sizes
  h1: 32, // Large page titles
  h2: 24, // Page headers
  h3: 20, // Section headers / Tab headers
  h4: 18, // Sub-section headers
  h5: 16, // Small headers

  // Body sizes
  xl: 18, // Extra large body
  lg: 16, // Large body
  md: 15, // Medium body (default)
  base: 14, // Base body text
  sm: 13, // Small text
  xs: 12, // Extra small text
  xxs: 11, // Tiny text (labels, captions)
};

// Line heights
export const lineHeights = {
  tight: 1.2, // For headings
  normal: 1.5, // For body text
  relaxed: 1.75, // For readable paragraphs
};

// Typography styles with default sizes
export const typography = {
  // Heading styles - Folito Font
  headingLightText: {
    fontFamily: fontFamilies.folito.light,
    fontSize: fontSizes.h3,
    color: primary,
  },
  headingRegularText: {
    fontFamily: fontFamilies.folito.regular,
    fontSize: fontSizes.h3,
    color: primary,
  },
  headingMediumText: {
    fontFamily: fontFamilies.folito.medium,
    fontSize: fontSizes.h3,
    color: primary,
  },
  headingSemiboldText: {
    fontFamily: fontFamilies.folito.semibold,
    fontSize: fontSizes.h3,
    color: primary,
  },
  headingBoldText: {
    fontFamily: fontFamilies.folito.bold,
    fontSize: fontSizes.h3,
    color: primary,
  },
  headingExtraboldText: {
    fontFamily: fontFamilies.folito.extrabold,
    fontSize: fontSizes.h2,
    color: primary,
  },
  headingBlackText: {
    fontFamily: fontFamilies.folito.black,
    fontSize: fontSizes.h1,
    color: primary,
  },

  // Body styles - Nunito Sans Font
  bodyExtralightText: {
    fontFamily: fontFamilies.nunitoSans.extralight,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodyLightText: {
    fontFamily: fontFamilies.nunitoSans.light,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodyRegularText: {
    fontFamily: fontFamilies.nunitoSans.regular,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodyMediumText: {
    fontFamily: fontFamilies.nunitoSans.medium,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodySemiboldText: {
    fontFamily: fontFamilies.nunitoSans.semibold,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodyBoldText: {
    fontFamily: fontFamilies.nunitoSans.bold,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodyExtraboldText: {
    fontFamily: fontFamilies.nunitoSans.extrabold,
    fontSize: fontSizes.base,
    color: primary,
  },
  bodyBlackText: {
    fontFamily: fontFamilies.nunitoSans.black,
    fontSize: fontSizes.base,
    color: primary,
  },

  // Small text variants
  bodySmallText: {
    fontFamily: fontFamilies.nunitoSans.regular,
    fontSize: fontSizes.sm,
    color: primary,
  },
  bodySmallSemiboldText: {
    fontFamily: fontFamilies.nunitoSans.semibold,
    fontSize: fontSizes.sm,
    color: primary,
  },
  captionText: {
    fontFamily: fontFamilies.nunitoSans.regular,
    fontSize: fontSizes.xs,
    color: border, // Muted color for captions
  },

  // Legacy aliases for backward compatibility
  mainRegularText: {
    fontFamily: fontFamilies.nunitoSans.regular,
    fontSize: fontSizes.base,
    color: primary,
  },
  mainMediumText: {
    fontFamily: fontFamilies.nunitoSans.medium,
    fontSize: fontSizes.base,
    color: primary,
  },
  mainSemiboldText: {
    fontFamily: fontFamilies.nunitoSans.semibold,
    fontSize: fontSizes.base,
    color: primary,
  },
  mainBoldText: {
    fontFamily: fontFamilies.nunitoSans.bold,
    fontSize: fontSizes.base,
    color: primary,
  },
};
