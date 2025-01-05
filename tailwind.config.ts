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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  darkMode: ["class", '[data-theme="chessuDark"]'],
  daisyui: {
    // based on daisyUI night and winter themes
    themes: [
      {
        chessuLight: {
          primary: "#047AFF",
          secondary: "#818CF8",
          accent: "#C148AC",
          neutral: "#9ab3d9",
          "base-100": "#FFFFFF",
          "base-200": "#F2F7FF",
          "base-300": "#E3E9F4",
          "base-content": "#394E6A",
          info: "#93E7FB",
          success: "#81CFD1",
          warning: "#EFD7BB",
          error: "#E58B8B",
        },
        chessuDark: {
          primary: "#38BDF8",
          secondary: "#818CF8",
          accent: "#1d4ed8",
          neutral: "#1E293B",
          "base-100": "#0F172A",
          info: "#0CA5E9",
          success: "#2DD4BF",
          warning: "#F4BF50",
          error: "#FB7085",
        },
      },
    ],
    darkTheme: "chessuDark",
  },
};
export default config;
