import { createGlobalStyle } from "styled-components";
import { mainTheme } from "./colors";

const BREAKPOINTS = {
  xs: 450,
  sm: 497,
  md: 730,
  lg: 767,
  xl: 850,
  xxl: 1074,
};

const TRANSITIONS = {
  speed: {
    md: "250ms",
  },
  ease: "ease-in-out",
};

const FONTSIZE = {
  sm: "14px",
  md: "15px",
  lg: "16px",
  xl: "18px",
};

const OPACITIES = {
  hover: 0.6,
  disable: 0.5,
  click: 0.4,
  enabled: 1,
};

const GAPS = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "24px",
  xl: "32px",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTheme = (): any => {
  return {
    ...mainTheme,
    mainPadLarge: "0 max(50px, calc((100vw - 1440px + 50px)/2))",
    mainPadSmall: "0 20px",
    gaps: GAPS,
    fontsize: FONTSIZE,
    opacity: OPACITIES,
    transitions: TRANSITIONS,
    breakpoints: BREAKPOINTS,
  };
};

export const ThemedGlobalStyle = createGlobalStyle`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-size: ${({ theme }): string => theme.fontsize.xl};
    color: ${({ theme }): string => theme.textPrimary};
    background: ${({ theme }): string => theme.bg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  main {
    display: flex;
    flex-direction: column;
  }

  @media (prefers-reduced-motion:no-preference){
    :root{
        scroll-behavior:smooth
    }
  }

  @media screen and (max-width: 1074px) {
    html {
      font-size: ${({ theme }): string => theme.fontsize.lg};
    }
  }
  
  @media screen and (max-width: 850px) {
    html {
      font-size: ${({ theme }): string => theme.fontsize.md};
    }
  }
  
  @media screen and (max-width: 450px) {
    html {
      font-size: ${({ theme }): string => theme.fontsize.sm};
    }
  }
`;
