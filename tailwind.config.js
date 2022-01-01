module.exports = {
  content: [
    "./projects/ngx-stripe-docs/src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      'ngst-white': '#fafafa'
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
