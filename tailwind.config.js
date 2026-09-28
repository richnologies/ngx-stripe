/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/ngx-stripe-docs/src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ngst: {
          ink: '#0b1220',
          muted: '#5b6577',
          soft: '#f4f6fb',
          line: '#e4e9f2',
          accent: '#635bff',
          'accent-dark': '#4b44d6',
          'accent-soft': '#eeedff',
          white: '#fafafa'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)',
        lift: '0 12px 40px rgba(99, 91, 255, 0.14)'
      },
      backgroundImage: {
        'ngst-mesh':
          'radial-gradient(ellipse 90% 70% at 10% -20%, rgba(99, 91, 255, 0.2), transparent 50%), radial-gradient(ellipse 70% 55% at 95% 5%, rgba(221, 42, 123, 0.08), transparent 45%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(14, 165, 233, 0.1), transparent 50%), linear-gradient(165deg, #e9edf6 0%, #e4e9f4 40%, #dde4f2 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
