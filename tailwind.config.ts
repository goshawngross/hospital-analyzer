import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "grade-a": "#22c55e",
        "grade-b": "#3b82f6",
        "grade-c": "#eab308",
        "grade-d": "#ef4444",
      },
    },
  },
  plugins: [],
};
export default config;
