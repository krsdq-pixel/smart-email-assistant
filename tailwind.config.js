/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#0B0F19',
        cyan: '#00E5FF',
        orange: '#FF9100',
      },
      boxShadow: {
        neon: '0 0 30px rgba(0, 229, 255, 0.18)',
      },
      animation: {
        pulseSoft: 'pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
