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
        morning: {
          50: '#fdfbf7',
          100: '#f9f6ed',
          200: '#f3ebd6',
          300: '#e9dab5',
          400: '#dcbe88',
          500: '#cfa562',
          600: '#b7874c',
          700: '#94663e',
          800: '#795137',
          900: '#644230',
        },
        zen: {
          50: '#f4f7f6',
          100: '#e5ece9',
          200: '#cedcd6',
          300: '#a7c2b7',
          400: '#7da395',
          500: '#5c8677',
          600: '#466b5e',
          700: '#38544a',
          800: '#2f433c',
          900: '#273832',
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
        serif: ['Nanum Myeongjo', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
};
