import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gangji 감성: 연한 그레이 종이톤 (노트 느낌)
        paper: {
          DEFAULT: "#F1F1F1",
          light: "#F8F8F8",
          dark: "#EAEAEA",
        },
        ink: {
          DEFAULT: "#2C2C2C",
          light: "#5C5C5C",
          muted: "#8C8C8C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
