import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          // A warmer, earthy off-white/beige tone replacing stark white
          ivory: "#f3efe6",
          // Muted, earthy village-like greens replacing bright digital greens
          forest: "#2d4a36",
          leaf: "#4b7156",
          sage: "#93a897",
          // Warmer natural accents (mustard/clay)
          saffron: "#cf8b2b",
          terracotta: "#c85f46",
          terra: "#c85f46",
          red: "#b43a29",
          teal: "#2b7c7c",
          // Warmer, softer dark for text instead of harsh black
          charcoal: "#2e2c29",
          neutral: "#e3dfd3",
          // Cards use a very light warm tone instead of pure white
          card: "#faf8f2",
          white: "#faf8f2"
        }
      },
      fontFamily: {
        google: ['"Google Sans"', '"Open Sans"', 'sans-serif'],
      },
      boxShadow: {
        // Softer, more natural drop shadow, eliminating glowy digital feel
        civic: "0 6px 16px -4px rgba(46, 44, 41, 0.05), 0 4px 6px -2px rgba(46, 44, 41, 0.02)"
      }
    },
  },
  plugins: [],
};
export default config;
