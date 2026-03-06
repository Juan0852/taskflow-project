/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/js/**/*.js'],
  corePlugins: {
    preflight: true
  },
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'slide-down': 'slideDown 0.2s ease-out'
      }
    }
  },
  plugins: []
};
