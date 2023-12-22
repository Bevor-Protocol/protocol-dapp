import { CSSProp, createGlobalStyle, css } from "styled-components";
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
  hover: 0.75,
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
  rem05: "0.5rem",
  rem1: "1rem",
  rem2: "2rem",
  rem3: "3rem",
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

export const getBreakpoint = (size: string, innerCSS: CSSProp): CSSProp => {
  return css`
    @media screen and (max-width: ${BREAKPOINTS[size as keyof typeof BREAKPOINTS]}px) {
      ${innerCSS}
    }
  `;
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
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  button {
    font-family: inherit !important;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }

  @media (prefers-reduced-motion:no-preference){
    :root{
        scroll-behavior:smooth
    }
  }

  ${getBreakpoint(
    "xxl",
    css`
      html {
        font-size: ${({ theme }): string => theme.fontsize.lg};
      }
    `,
  )}

  ${getBreakpoint(
    "xl",
    css`
      html {
        font-size: ${({ theme }): string => theme.fontsize.md};
      }
    `,
  )}

  ${getBreakpoint(
    "xs",
    css`
      html {
        font-size: ${({ theme }): string => theme.fontsize.sm};
      }
    `,
  )}
`;
