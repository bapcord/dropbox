/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dropbox-blue': '#0061FF',
        'dropbox-hover': '#0057E5',
        'dropbox-gray': '#1E1919'
      },
      fontFamily: {
        sans: ['Atlas Grotesk Web', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} 