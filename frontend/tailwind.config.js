/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Joyseno palette
        primary: "#fa7e23",          // orange — CTA buttons
        "primary-light": "#ff9a52",
        "primary-glow": "#fa7e23",
        accent: "#f5c729",           // yellow — section titles
        ink: "#252f2d",              // charcoal — footer, hover, headings
        "ink-soft": "#3d4a47",
        cream: "#fefefd",
        surface: "#f9f9f9",
        muted: "#666666",
        // legacy tokens remapped to light-theme equivalents
        dark: "#fefefd",
        "dark-card": "#ffffff",
        "dark-border": "#eae7dd",
        "dark-surface": "#f6f4ee",
      },
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        body: ["'Poppins'", "sans-serif"],
        mono: ["'Poppins'", "sans-serif"],
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
          "0%, 100%": { boxShadow: "0 12px 30px rgba(250,126,35,0.18)" },
          "50%": { boxShadow: "0 18px 44px rgba(250,126,35,0.38)" },
        },
      },
    },
  },
  plugins: [],
}

