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
        "background-light": "#FFFFFF",
        "foreground-start": "#F5F5F5",
        "foreground-end": "#E6E6E6",
        "nav-start": "#E6E6E6",
        "nav-end": "#D9D9D9"
      }
    },
  },
  plugins: [],
};
export default config;
