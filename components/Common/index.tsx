"use client";

import styled, { css } from "styled-components";

export const CommonPad = css`
  padding: ${({ theme }): string => theme.mainPadLarge};

  @media screen and (max-width: ${({ theme }): string => theme.breakpoints.xs}px) {
    padding: ${({ theme }): string => theme.mainPadSmall};
  }
`;

export const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
