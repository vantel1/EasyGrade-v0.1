// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Tell Tailwind to purge unused styles in production
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

