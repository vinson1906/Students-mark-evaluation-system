/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f1f4fb',
          300: '#9fb0d6',
          600: '#2a4590',
          700: '#1d3470',
          800: '#152858',
          900: '#0e1d42',
          950: '#0a1530',
        },
      },
    },
  },
  plugins: [],
};
