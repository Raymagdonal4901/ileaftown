/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#cfcfcf',
          300: '#b0b0b0',
          400: '#8c8c8c',
          500: '#6d6d6d',
          600: '#555555',
          700: '#464646',
          800: '#3a3a3a',
          900: '#323232',
          950: '#1a1a1a', // Deep Charcoal
        },
        pearl: '#F8F8F8',
        gold: '#D4AF37', // Polished Gold
        brass: '#B5A642', // Brass
      },
      fontFamily: {
        sans: ['Kanit', 'Inter', 'sans-serif'],
        display: ['Kanit', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
