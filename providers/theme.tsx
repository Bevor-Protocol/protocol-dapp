"use client";

import { ThemeProvider } from "styled-components";
import { getTheme, ThemedGlobalStyle } from "@/theme";

const Theme = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <ThemeProvider theme={getTheme()}>
      <ThemedGlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
