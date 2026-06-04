import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        gold: "#ffd700",
        purple: "#9f7aea",
        cyan: "#22d3ee",
        glass: "rgba(255,255,255,0.05)",
        "glass-border": "rgba(255,215,0,0.15)",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Syne", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 20px rgba(255,215,0,0.3)",
        "gold-lg": "0 0 40px rgba(255,215,0,0.4)",
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        typewriter: "typewriter 3s steps(40) 1s forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,215,0,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,215,0,0.6)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
