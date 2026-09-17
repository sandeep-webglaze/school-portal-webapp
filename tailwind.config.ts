import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-offset)"],
      },
      colors: {
        // ---------------------------------------------------------------
        // BRAND: Royal Blue & Gold
        // The whole app was originally themed with the tailwind `green`
        // scale. We remap `green` and `greenish` to royal blue here so every
        // existing `bg-green-600`, `text-green-500`, `hover:text-green-400`,
        // `text-greenish-light` etc. across the codebase becomes blue with no
        // per-file edits. New code should prefer `primary` / `gold` below.
        // ---------------------------------------------------------------
        green: {
          400: "#3b6fd4", // lighter blue (used by hover states)
          500: "#1e4fa3", // primary royal blue
          600: "#173e82", // darker royal blue
        },
        greenish: {
          light: "#1e4fa3",
        },
        primary: {
          light: "#3b6fd4",
          DEFAULT: "#1e4fa3",
          dark: "#163b7a",
        },
        gold: {
          light: "#e6c458",
          DEFAULT: "#d4af37",
          dark: "#b8952e",
        },
        blacky: {
          default: "#000000",
          light: "#16264d", // deep navy — footer / top bar background
        },
        grayish: {
          light: "#eef3fb",
        },
        darker: {
          black: "#0f1b33",
          white: "#EEEEEE",
        },
      },
      boxShadow: {
        light: "0 0px 0px #3a3a4429, 0 0px 10px #5a5b6a29",
        spread: "0 4px 8px #3a3a4429, 0 8px 16px #5a5b6a29",
      },
    },
  },
  plugins: [],
};
export default config;
