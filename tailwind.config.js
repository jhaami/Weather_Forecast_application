/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'sky-gradient': 'linear-gradient(to right, #00c6ff, #0072ff)',
        'sunset-gradient': 'linear-gradient(to right, #f2994a, #f2c94c)',
      }
    },
  },
  plugins: [],
}

