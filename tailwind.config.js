/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        parchment: '#FAF5EF',
        charcoal: '#1C1C1C',
        gold: '#C9A84C',
        'gold-light': '#E8D5A3',
        coral: '#E07A5F',
        sage: '#81B29A',
        sky: '#7FB5C1',
      },
      animation: {
        'gradient-shift': 'gradientShift 6s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
