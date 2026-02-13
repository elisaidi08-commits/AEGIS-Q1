/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'aegis-black': '#0B0F14',
        'aegis-green': '#00F5A0',
        'aegis-blue': '#3B82F6',
        'aegis-purple': '#7C3AED',
        'aegis-white': '#F5F5F5',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(0, 245, 160, 0.3)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 30px rgba(124, 58, 237, 0.3)',
      },
      backgroundImage: {
        'radial-green': 'radial-gradient(circle, rgba(0, 245, 160, 0.15) 0%, transparent 70%)',
        'radial-blue': 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
