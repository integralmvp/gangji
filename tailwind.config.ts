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
        // Gangji 감성: 갱지 무지노트의 아날로그 감성
        paper: {
          DEFAULT: "#F5E9DA",
          light: "#FAF3E8",
          dark: "#EBD5C1",
        },
        ink: {
          DEFAULT: "#3D2817",
          light: "#6B4E3D",
        },
      },
    },
  },
  plugins: [],
};
export default config;
