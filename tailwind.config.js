/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // SA/DA brand colors
        primaryNavy: '#081A4B',
        primaryHover: '#061533',
        primaryLight: '#EFF3FB',

        // POS semantic colors – minimalist light palette
        brandGreen: '#15803d',       // main brand green, used sparingly
        brandGreenDark: '#14532d',   // darker green for hover/active states
        neutralDark: '#111827',      // primary text, dark gray
        neutralGray: '#6b7280',      // secondary/muted text
        neutralLight: '#f9fafb',     // main background
        neutralCard: '#ffffff',      // card/panel background
        neutralHover: '#f3f4f6',     // hover states for non-primary elements
        neutralBorder: '#e5e7eb',    // subtle borders/dividers
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
