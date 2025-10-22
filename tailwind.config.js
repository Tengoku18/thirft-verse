// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"], // Adjust paths as needed
  theme: {
    fontFamily: {
      // Set Nunito Sans as default sans-serif (body text)
      sans: ["NunitoSans_400Regular"],

      // Set Playfair Display as default serif (headings)
      serif: ["PlayfairDisplay_400Regular"],

      // Additional font weight variants
      "sans-extralight": ["NunitoSans_200ExtraLight"],
      "sans-light": ["NunitoSans_300Light"],
      "sans-medium": ["NunitoSans_500Medium"],
      "sans-semibold": ["NunitoSans_600SemiBold"],
      "sans-bold": ["NunitoSans_700Bold"],
      "sans-extrabold": ["NunitoSans_800ExtraBold"],
      "sans-black": ["NunitoSans_900Black"],

      playfair: ["PlayfairDisplay_400Regular"],
      "playfair-medium": ["PlayfairDisplay_500Medium"],
      "playfair-semibold": ["PlayfairDisplay_600SemiBold"],
      "playfair-bold": ["PlayfairDisplay_700Bold"],
      "playfair-extrabold": ["PlayfairDisplay_800ExtraBold"],
      "playfair-black": ["PlayfairDisplay_900Black"],
    },
    extend: {
      colors: {
        // Primary - Rich espresso brown (vintage and warmth)
        primary: {
          DEFAULT: "#3B2F2F",
          50: "#F5F3F3",
          100: "#E8E4E4",
          200: "#D1C9C9",
          300: "#B0A3A3",
          400: "#8A7777",
          500: "#3B2F2F",
          600: "#2F2525",
          700: "#231C1C",
          800: "#181313",
          900: "#0C0A0A",
        },
        // Secondary - Warm tan (thrift authenticity)
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
        // Background - Soft off-white (airy and modern)
        background: {
          DEFAULT: "#FAF7F2",
          light: "#FFFFFF",
          dark: "#F5F2ED",
        },
        // Surface - Clean contrast for premium layering
        surface: "#FFFFFF",
        // Border / Muted Text - Subtle neutral for boundaries
        border: "#C7BFB3",
        muted: "#C7BFB3",
        // Accent 1 - Muted olive (earthy tone)
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
        // Accent 2 - Clay blush (elegant and warm)
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
