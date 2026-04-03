// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      // Set Nunito Sans as default sans-serif (body text)
      sans: ["NunitoSans_400Regular"],

      // Set Folito as default serif (headings)
      serif: ["Folito_400Regular"],

      // Nunito Sans font weight variants (body text)
      "sans-extralight": ["NunitoSans_200ExtraLight"],
      "sans-light": ["NunitoSans_300Light"],
      "sans-medium": ["NunitoSans_500Medium"],
      "sans-semibold": ["NunitoSans_600SemiBold"],
      "sans-bold": ["NunitoSans_700Bold"],
      "sans-extrabold": ["NunitoSans_800ExtraBold"],
      "sans-black": ["NunitoSans_900Black"],

      // Folito font weight variants (headings)
      folito: ["Folito_400Regular"],
      "folito-medium": ["Folito_500Medium"],
      "folito-semibold": ["Folito_600SemiBold"],
      "folito-bold": ["Folito_700Bold"],
      "folito-extrabold": ["Folito_800ExtraBold"],
      "folito-black": ["Folito_900Black"],
    },
    extend: {
      colors: {
        // ============================================
        // BRAND COLORS (New Definitive Palette)
        // ============================================
        brand: {
          espresso: "#3B3030", // Primary text, buttons
          tan: "#D4A373", // Call-to-action, accents
          beige: "#E5E1DA", // Card backgrounds, borders
          "off-white": "#FAF7F2", // Main background
          surface: "#FFFFFF", // Cards, inputs
          badge: "#E8DCC8", // Badge background (referral, etc)
        },

        // ============================================
        // STATUS & FEEDBACK COLORS
        // ============================================
        status: {
          success: "#059669",
          "success-bg": "#D1FAE5",
          error: "#DC2626",
          "error-bg": "#FEE2E2",
          warning: "#D97706",
          "warning-bg": "#FEF3C7",
          info: "#2563EB",
          "info-bg": "#DBEAFE",
          refund: "#7C3AED",
          "refund-bg": "#E9D5FF",
        },

        // ============================================
        // UI ACCENTS & NEUTRALS
        // ============================================
        ui: {
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          "border-light": "#E5E7EB",
          "border-themed": "#C7BFB3",
          elite: "#FCD34D",
          "referral-reward-bg": "#FDFCFB",
        },

        // ============================================
        // SCREEN BACKGROUND
        // ============================================
        "screen-bg": "#FAF7F2",

        // ============================================
        // INPUT FIELD COLORS (with opacity variants)
        // ============================================
        input: {
          label: "#3B3030", // Label text 100%
          border: "rgba(59, 48, 48, 0.2)", // Border 20%
          "border-focus": "#3B3030", // Border on focus 100%
          placeholder: "rgba(59, 48, 48, 0.4)", // Placeholder 40%
          text: "#3B3030", // Input text 100%
          icon: "rgba(59, 48, 48, 0.6)", // Icon 60%
        },

        // ============================================
        // SEMANTIC COLORS
        // ============================================
        semantic: {
          text: {
            primary: "#3B3030",
            secondary: "#6B7280",
            tertiary: "#9CA3AF",
            inverse: "#FFFFFF",
          },
          background: {
            primary: "#FAF7F2",
            secondary: "#FFFFFF",
            tertiary: "#F3F4F6",
          },
          border: {
            light: "#E5E7EB",
            themed: "#C7BFB3",
            strong: "#9CA3AF",
          },
          interactive: {
            primary: "#D4A373",
            success: "#059669",
            warning: "#D97706",
            error: "#DC2626",
            info: "#2563EB",
          },
        },

        // ============================================
        // LEGACY COLORS (for backward compatibility)
        // ============================================
        primary: {
          DEFAULT: "#3B3030",
          50: "#F5F3F3",
          100: "#E8E4E4",
          200: "#D1C9C9",
          300: "#B0A3A3",
          400: "#8A7777",
          500: "#3B3030",
          600: "#2F2525",
          700: "#231C1C",
          800: "#181313",
          900: "#0C0A0A",
        },
        secondary: {
          DEFAULT: "#D4A373",
          50: "#FAF6F1",
          100: "#F5EDE3",
          200: "#EBDBC7",
          300: "#E1C9AB",
          400: "#D7B68F",
          500: "#D4A373",
          600: "#C88F5C",
          700: "#B07545",
          800: "#8A5C36",
          900: "#5C3D24",
        },
        background: {
          DEFAULT: "#FAF7F2",
          light: "#FFFFFF",
          dark: "#F5F2ED",
        },
        surface: "#FFFFFF",
        border: "#C7BFB3",
        muted: "#C7BFB3",
        accent1: {
          DEFAULT: "#6B705C",
          50: "#F4F5F3",
          100: "#E9EAE7",
          200: "#D3D5CF",
          300: "#BDC0B7",
          400: "#A7AB9F",
          500: "#6B705C",
          600: "#565A4A",
          700: "#404437",
          800: "#2B2D25",
          900: "#151712",
        },
        accent2: {
          DEFAULT: "#CB997E",
          50: "#FAF6F3",
          100: "#F5EDE7",
          200: "#EBDBCF",
          300: "#E1C9B7",
          400: "#D7B79F",
          500: "#CB997E",
          600: "#BC8565",
          700: "#A86D4C",
          800: "#86563D",
          900: "#5A3A29",
        },
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
