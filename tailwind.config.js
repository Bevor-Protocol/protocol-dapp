/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      "2xl": { max: "1536px" },
      xl: { max: "1280px" },
      lg: { max: "1024px" },
      md: { max: "768px" },
      sm: { max: "640px" },
      xs: { max: "450px" },
    },
    extend: {
      boxShadow: {
        DEFAULT: "0 0 0 1px rgba(255, 255, 255, 0.145), 0px 1px 2px rgba(0,0,0,.16)",
      },
      gridTemplateColumns: {
        14: "repeat(16, minmax(0, 1fr))",
      },
      rotate: {
        135: "135deg",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      transitionProperty: {
        border: "border",
      },
      transitionDuration: {
        1250: "1250ms",
      },
      opacity: {
        hover: 0.75,
        disable: 0.5,
        click: 0.4,
        enabled: 1,
      },
      spacing: {
        "content-limit": "var(--padding-screen)",
      },
      keyframes: {
        shrink: {
          "0%, 100%": {
            transform: "scale(1) rotateX(80deg)",
            opacity: 1,
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "scale(0) rotateX(80deg)",
            opacity: 0.25,
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        appear: {
          "0%": {
            opacity: 0,
            transform: "scale(0.7)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
        panel: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        shrink: "shrink 1s infinite",
        appear: "appear 0.15s",
        panel: "panel 0.15s",
      },
      colors: {
        dark: "#121212",
        "off-white": "#F4F5F7",
        "dark-white": "#C8D0E7",
        muted: "hsl(240 3.7% 15.9%)",
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
