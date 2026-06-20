/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans Flex"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};