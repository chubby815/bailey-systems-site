/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0a0a0a",
          secondary: "#8b7355",
          accent: "#8b7355",
          yellow: "#F4C430",
          yellowHover: "#E6B800",
        },
        background: "#faf9f6",
        ink: {
          300: "#666666",
        },
      },
      boxShadow: {
        "frosted-card": "0 8px 16px rgba(0, 0, 0, 0.2)",
        "glow-primary": "0 0 0 rgba(0, 0, 0, 0)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
