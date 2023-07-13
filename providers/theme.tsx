"use client";

import { ThemeProvider } from "styled-components";
import { getTheme, ThemedGlobalStyle } from "@/theme";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <ThemeProvider theme={getTheme()}>
      <ThemedGlobalStyle />
      {children}
    </ThemeProvider>
  );
};
