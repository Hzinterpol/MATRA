/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#006569', deep: '#00494B', ink: '#17324D', body: '#334155', muted: '#64748B',
        line: '#DCE5E8', canvas: '#F2F5F7', mint: '#E6F4F3', lime: '#FFDD00',
        success: '#15803D', danger: '#B42318', warning: '#A16207', info: '#1D4ED8'
      },
      fontFamily: { sans: ['Poppins','ui-sans-serif','system-ui','sans-serif'] },
      boxShadow: { soft: '0 10px 36px rgba(10,47,57,.05)', hover: '0 16px 40px rgba(0,101,105,.09)' },
      maxWidth: { content: '1160px' }
    }
  },
  plugins: []
};
