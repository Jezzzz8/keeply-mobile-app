/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#bd44ff', dark: '#9b2fe0' },
        background: { DEFAULT: '#f8f9fa', dark: '#121212' },
        card: { DEFAULT: '#ffffff', dark: '#1e1e1e' },
        text: { DEFAULT: '#1a1a1a', dark: '#e0e0e0' },
        textLight: { DEFAULT: '#666666', dark: '#a0a0a0' },
        border: { DEFAULT: '#f0f0f0', dark: '#2c2c2c' },
        error: { DEFAULT: '#ff3b30', dark: '#ff6b6b' },
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        semibold: ['System'],
        bold: ['System'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
        xxxl: '28px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '24px',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '999px',
      },
    },
  },
  plugins: [],
}