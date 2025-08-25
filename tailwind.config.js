/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primaryNavy: '#081A4B',
        primaryHover: '#061533',
        primaryLight: '#EFF3FB',

        // Green palette based on bg-green-500
        brandGreen: '#22c55e',       // main green
        brandGreenDark: '#15803d',   // hover/active
        brandGreenLight: '#4ade80',  // lighter accents

        // Optional neutral colors
        neutralLight: '#f9fafb',     // background
        neutralDark: '#1f2937',      // text
      },

      // Animation for login card
      keyframes: {
        slideFadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        slideFadeIn: 'slideFadeIn 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
};
