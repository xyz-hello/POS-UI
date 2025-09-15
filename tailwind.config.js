/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryNavy: '#081A4B',
        primaryHover: '#061533',
        primaryLight: '#EFF3FB',
        brandGreen: '#15803d',
        brandGreenDark: '#14532d',
        neutralDark: '#111827',
        neutralGray: '#6b7280',
        neutralLight: '#f9fafb',
        neutralCard: '#ffffff',
        neutralHover: '#f3f4f6',
        neutralBorder: '#e5e7eb',
      },
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
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
