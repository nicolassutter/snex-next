/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      maxWidth: ({ theme }) => ({
        ...theme('spacing'),
      }),
    },
  },
  plugins: [require('daisyui')],
}
