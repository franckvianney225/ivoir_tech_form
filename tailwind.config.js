/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ivoirtech-green': '#009E44',
        'placeholder-orange': '#FFD180',
        primary: '#2C3E50',
        secondary: '#E74C3C',
      },
    },
  },
  plugins: [],
}
