/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryNavy: '#081A4B',
        primaryHover: '#061533',
        primaryLight: '#EFF3FB',
        okGreen: 'oklch(70.4% 0.14 182.503)',
        okGreenDark: "#15803d",
      },
    },
  },
  plugins: [],
};