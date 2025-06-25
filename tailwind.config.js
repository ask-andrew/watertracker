/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Root index.html
    "./index.tsx", // Root index.tsx
    "./src/**/*.{js,ts,jsx,tsx}", // All relevant files in src
    "./components/**/*.{js,ts,jsx,tsx}", // Components directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
