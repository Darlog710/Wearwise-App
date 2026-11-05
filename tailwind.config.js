/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          primary: '#006778',
          'primary-hover': '#005462',
          'primary-light': '#E0F4F7',
          secondary: '#467882',
          'secondary-light': '#E3EFF1',
          tertiary: '#00363F',
          'tertiary-tint': '#9FE1ED',
          accent: '#D35E35',
          'accent-hover': '#BC502A',
          'accent-soft': '#FDF1EC',
          'accent-glow': '#FF8A65',
        },
        m3: {
          surface: '#F7FAFA',
          'surface-container': '#EDF3F4',
          'surface-container-high': '#E2ECEE',
          'surface-container-highest': '#D5E3E6',
          'surface-variant': '#D9E4E7',
          'on-surface': '#151D1F',
          'on-surface-variant': '#3F484A',
          outline: '#6F797B',
          'outline-variant': '#BFC8CA',
          'outline-subtle': '#E1E8EA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(0, 103, 120, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 20px -4px rgba(0, 103, 120, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 12px 32px -6px rgba(0, 103, 120, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'accent-glow': '0 4px 20px -2px rgba(211, 94, 53, 0.25)',
      }
    },
  },
  plugins: [],
}

