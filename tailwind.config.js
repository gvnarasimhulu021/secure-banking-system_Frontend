/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#085041',
        'medium-green': '#0F6E56',
        'light-green-bg': '#E1F5EE',
        accent: '#9FE1CB',
        danger: '#A32D2D',
        'light-red-bg': '#FCEBEB',
        'info-blue': '#185FA5',
        'light-blue-bg': '#E6F1FB',
        'purple-bg': '#EEEDFE',
        'purple-text': '#3C3489',
        'amber-bg': '#FAEEDA',
        'amber-text': '#633806'
      },
      borderRadius: {
        'small': '8px',
        'card': '12px'
      },
      borderWidth: {
        '0.5': '0.5px'
      },
      fontWeight: {
        'normal': '400',
        'medium': '500'
      }
    },
  },
  plugins: [],
}
