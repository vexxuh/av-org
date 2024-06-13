import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  keyframes: {
    "accordion-down": {
      from: { height: "0" },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
    outline: {
      from: { strokeDasharray: "0, 345.576px" },
      to: { strokeDasharray: "345.576px, 345.576px" },
    },
    circle: {
      from: { transform: "scale(1)" },
      to: { transform: "scale(0)" },
    },
    check: {
      from: { strokeDasharray: "0, 75px" },
      to: { strokeDasharray: "75px, 75px" },
    },
    "check-group": {
      from: { transform: "scale(1)" },
      "50%": { transform: "scale(1.09)" },
      to: { transform: "scale(1)" },
    },
    "collapsible-down": {
      from: {
        height: "0px",
        transform: "translateY(-1rem)",
        opacity: "0%",
      },
      "40%": { opacity: "0%" },
      to: {
        height: "var(--radix-collapsible-content-height)",
      },
    },
    "collapsible-up": {
      from: { height: "var(--radix-collapsible-content-height)" },
      "40%": { opacity: "0%" },
      to: { height: "0px", opacity: "0%", transform: "translateY(-1rem)" },
    },
  },
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    "collapsible-down": "collapsible-down 0.4s ease-out",
    "collapsible-up": "collapsible-up 0.4s ease-out",
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
