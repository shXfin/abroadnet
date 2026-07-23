/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1740",
        navy: "#241E5E",
        coral: "#F0633B",
        paper: "#F7F4EE",
        parchment: "#EDE8DD",
        mist: "#77739B",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      letterSpacing: {
        caps: "0.18em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
        "marquee-slow": "marquee 50s linear infinite",
      },
    },
  },
  plugins: [],
};
