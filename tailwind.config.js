/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        math: {
          addition: "#22c55e",
          subtraction: "#ef4444",
          multiplication: "#3b82f6",
          division: "#f59e0b",
        }
      },
    },
  },
  plugins: [],
}
