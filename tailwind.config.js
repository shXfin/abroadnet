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
        // 36s was tuned for the 16 Malaysia-only names this used to carry.
        // The ticker now carries 37 (Malaysia + Italy + China + Romania),
        // so the duration is scaled up by the same ~2.3x to keep the
        // per-name pace (and reading speed) exactly what it was before —
        // otherwise the same 36s has to cover more distance and everything
        // just feels rushed.
        marquee: "marquee 82s linear infinite",
        "marquee-slow": "marquee 50s linear infinite",
      },
    },
  },
  plugins: [],
};
