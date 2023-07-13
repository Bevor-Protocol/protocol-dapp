"use client";

import { css } from "styled-components";

export const CommonPad = css`
  padding: ${({ theme }): string => theme.mainPadLarge};

  @media screen and (max-width: ${({ theme }): string => theme.breakpoints.xs}px) {
    padding: ${({ theme }): string => theme.mainPadSmall};
  }
`;
