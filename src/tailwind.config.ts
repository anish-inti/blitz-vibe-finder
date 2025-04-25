
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blitz-black": "#000000",
        "blitz-neonred": "#ea384c",
        "blitz-pink": "#D946EF",
        "blitz-purple": "#9b87f5",
        "blitz-blue": "#33C3F0",
        "blitz-stardust": "#FFDEE2",
        "blitz-gray": "#1F1F1F",
        "blitz-lightgray": "#8E9196",
        "blitz-offwhite": "#F1F1F1",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "sparkle": "sparkle 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.5)" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
