/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryNavy: '#081A4B',        // existing navy
        primaryHover: '#061533',       // existing hover
        primaryLight: '#EFF3FB',       // existing light background
        okGreen: 'oklch(70.4% 0.14 182.503)', // new OKLCH green
      },
    },
  },
  plugins: [],
};
