// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"], // Adjust paths as needed
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
