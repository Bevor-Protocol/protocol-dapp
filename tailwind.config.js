/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    boxShadow: {
      DEFAULT: "0 0 0 1px rgba(255, 255, 255, 0.145), 0px 1px 2px rgba(0,0,0,.16)",
    },
    screens: {
      "2xl": { max: "1536px" },
      xl: { max: "1280px" },
      lg: { max: "1024px" },
      md: { max: "768px" },
      sm: { max: "640px" },
      xs: { max: "450px" },
    },
    extend: {
      opacity: {
        hover: 0.75,
        disable: 0.5,
        click: 0.4,
        enabled: 1,
      },
      spacing: {
        screen: "var(--padding-screen)",
      },
      colors: {
        dark: "#121212",
        "off-white": "#F4F5F7",
        "dark-white": "#C8D0E7",
        primary: "#004080",
        "primary-light": {
          15: "color-mix(in oklab, #004080, #FFFFFF 15%)",
          20: "color-mix(in oklab, #004080, #FFFFFF 20%)",
          25: "color-mix(in oklab, #004080, #FFFFFF 25%)",
          30: "color-mix(in oklab, #004080, #FFFFFF 30%)",
          35: "color-mix(in oklab, #004080, #FFFFFF 35%)",
          40: "color-mix(in oklab, #004080, #FFFFFF 40%)",
          50: "color-mix(in oklab, #004080, #FFFFFF 50%)",
        },
        "dark-primary": {
          15: "color-mix(in oklab, #121212, #004080 15%)",
          20: "color-mix(in oklab, #121212, #004080 20%)",
          25: "color-mix(in oklab, #121212, #004080 25%)",
          30: "color-mix(in oklab, #121212, #004080 30%)",
          35: "color-mix(in oklab, #121212, #004080 35%)",
          40: "color-mix(in oklab, #121212, #004080 40%)",
          50: "color-mix(in oklab, #121212, #004080 50%)",
        },
        "dark-light": {
          15: "color-mix(in oklab, #121212, #FFFFFF 15%)",
          20: "color-mix(in oklab, #121212, #FFFFFF 20%)",
          25: "color-mix(in oklab, #121212, #FFFFFF 25%)",
          30: "color-mix(in oklab, #121212, #FFFFFF 30%)",
          35: "color-mix(in oklab, #121212, #FFFFFF 35%)",
          40: "color-mix(in oklab, #121212, #FFFFFF 40%)",
          50: "color-mix(in oklab, #121212, #FFFFFF 50%)",
        },
      },
    },
  },
  plugins: [],
};
