/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/js/**/*.js'],
  corePlugins: {
    preflight: true
  },
  theme: {
    extend: {}
  },
  plugins: []
};
