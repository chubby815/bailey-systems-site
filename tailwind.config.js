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
        background: "#0d0e0f",
        ink: {
          300: "#666666",
        },
        military: {
          green: "#4b5320",
          bg: "#1a1a1b",
          amber: "#ffb000",
          cyan: "#00d4ff",
          dark: "#0d0e0f",
          card: "#111418",
          border: "rgba(75,83,32,0.4)",
        },
      },
      boxShadow: {
        "frosted-card": "0 8px 16px rgba(0, 0, 0, 0.2)",
        "glow-primary": "0 0 0 rgba(0, 0, 0, 0)",
        "amber-glow": "0 0 15px rgba(255,176,0,0.4)",
        "green-glow": "0 0 15px rgba(75,83,32,0.6)",
        "tac-card": "inset 0 0 0 1px rgba(75,83,32,0.3), 0 0 20px rgba(0,0,0,0.5)",
      },
      fontFamily: {
        sans: ["'Share Tech Mono'", "JetBrains Mono", "Courier New", "monospace"],
        mono: ["'Share Tech Mono'", "JetBrains Mono", "Courier New", "monospace"],
        syne: ["'Share Tech Mono'", "JetBrains Mono", "monospace"],
        dm: ["'Share Tech Mono'", "JetBrains Mono", "monospace"],
        tactical: ["'Share Tech Mono'", "JetBrains Mono", "Courier New", "monospace"],
      },
      animation: {
        "border-pulse": "border-pulse-green 1.5s ease-in-out infinite",
        "tac-blink": "tac-blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
