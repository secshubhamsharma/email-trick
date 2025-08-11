/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    // Crucial: This path tells Tailwind to scan HeroUI's package for classes
    './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // HeroUI uses a 'dark' class on the HTML element for dark mode
  plugins: [heroui()], // Enable the HeroUI Tailwind plugin
}