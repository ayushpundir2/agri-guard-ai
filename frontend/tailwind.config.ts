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
          ivory: "#F7F5EE",
          forest: "#14532D",
          leaf: "#3F7D4A",
          sage: "#8FAF8B",
          saffron: "#D99A2B",
          terracotta: "#D65A3A",
          terra: "#D65A3A",
          red: "#B42318",
          teal: "#168A8A",
          charcoal: "#26332B",
          neutral: "#EAE7DC",
          card: "#FFFFFF",
          white: "#FFFFFF"
        }
      },
      boxShadow: {
        civic: "0 4px 20px -2px rgba(38, 51, 43, 0.08), 0 2px 6px -1px rgba(38, 51, 43, 0.04)"
      }
    },
  },
  plugins: [],
};
export default config;
