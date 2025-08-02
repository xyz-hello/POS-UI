/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryNavy: '#081A4B',
        primaryHover: '#061533',
        primaryLight: '#EFF3FB',
        primaryBorder: '#C5CFE1' // Violet-600
      },
    },
  },
  plugins: [],
};
