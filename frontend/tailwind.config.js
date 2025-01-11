module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#581C87',
        'custom-indigo': '#7C3AED',
        'custom-blue': '#6366F1',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.purple.500"), 0 0 20px theme("colors.purple.500")',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}