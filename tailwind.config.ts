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
        // Gangji 갱지 연그레이 종이톤
        paper: {
          DEFAULT: "#F1F1EF",
          light: "#F8F8F7",
          dark: "#E8E8E6",
        },
        note: "#DDDDD9",   // NOTE 중앙 배경 — 연회색
        app: "#CECECB",    // 전체 앱 배경
        ink: {
          DEFAULT: "#2C2C2A",
          light: "#5C5C5A",
          muted: "#8C8C8A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
