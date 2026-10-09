/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#0B0F19',
        cyan: '#00E5FF',
        orange: '#FF9100',
      },
      boxShadow: {
        neon: '0 0 30px rgba(0, 229, 255, 0.20)',
      },
    },
  },
  plugins: [],
};
