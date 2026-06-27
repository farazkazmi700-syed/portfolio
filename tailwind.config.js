/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#059669",
        "primary-light": "#10b981",
        "primary-glow": "#059669",
        dark: "#0a0a0f",
        "dark-card": "#111118",
        "dark-border": "#1e1e2e",
        "dark-surface": "#161620",
        accent: "#7c3aed",
      },
      fontFamily: {
        display: ["'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(5,150,105,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(5,150,105,0.7)" },
        },
      },
    },
  },
  plugins: [],
}
