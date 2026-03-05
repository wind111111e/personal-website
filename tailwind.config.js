/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#1a1a1a',
        primary: '#3b82f6', // Changed to Blue 500 (matching Hero particles)
        secondary: '#6366f1', // Indigo 500 (swapped)
      },
      fontFamily: {
        sans: ['Inter', 'Source Han Sans CN', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}