/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    screens: {
      smx: { max: '767px' },
      ...defaultTheme.screens,
    },
    colors: {
      darkBlue: {
        50: '#F2F8FF',
        100: '#55A6FF',
        200: '#2188FF',
        300: '#023B78',
        800: '#0D0F1A',
        900: '#17192D',
      },
      gray: {
        50: '#fff',
        100: '#F5F5F5',
        200: '#E5E5E5',
        250: '#E3EAEF',
        300: '#D4D4D4',
        350: '#D8DFE6',
        400: '#A3A3A3',
        500: '#737373',
        550: '#77818C',
        600: '#525252',
        650: '#88929C',
        700: '#404040',
        800: '#262626',
        850: '#24292F',
        900: '#171717',
      },
      red: {
        200: '#FF4D4F',
        300: '#FF0000',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      roboto: ['Roboto', 'sans-serif'],
    },
    extend: {
      keyframes: {
        sideways: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-60%)' },
        },
      },
      animation: {
        sideways: 'sideways 8s linear infinite',
      },
    },
  },
  plugins: [],
};
