/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0A0705',
        'secondary-bg': '#15100B',
        'accent-gold': '#D4AF37',
        'accent-gold-hover': '#C9A227',
        'text-primary': '#F5F1E8',
        'text-secondary': '#B8AFA0',
        'gold-border': 'rgba(212,175,55,0.25)',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        body: ['"Poppins"', 'sans-serif'],
      },
      borderWidth: {
        DEFAULT: '1px',
      },
    },
  },
  plugins: [],
};
