"use client";

import styled, { css } from "styled-components";

import { getBreakpoint } from "@/theme";
import { Grid, Column } from "@/components/Box";

export const Home = styled(Grid)`
  grid-template-columns: repeat(2, 1fr);
  width: 100%;

  ${getBreakpoint(
    "md",
    css`
      grid-template-columns: 1fr;
    `,
  )}
`;

export const HomeText = styled(Column)`
  text-align: left;

  ${getBreakpoint(
    "md",
    css`
      text-align: center;
      align-items: center;
    `,
  )}
`;

export const HomeStats = styled(Grid)`
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  position: relative;
  z-index: 1;

  ${getBreakpoint(
    "xxl",
    css`
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
    `,
  )}
  ${getBreakpoint(
    "md",
    css`
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
    `,
  )}
  ${getBreakpoint(
    "sm",
    css`
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
    `,
  )}

  &::before {
    content: " ";
    display: flex;
    position: absolute;
    inset: 0px;
    transform: scale(1.1);
    filter: blur(50px);
    background-color: ${({ theme }): string => theme.primaryMix70};
    z-index: -2;
  }
`;

export const HomeStat = styled(Column)`
  background-color: ${({ theme }): string => theme.bg};
  box-shadow: ${({ theme }): string => theme.boxShadow};
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  transition: background-color ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    background-color: ${({ theme }): string => theme.primaryMix20};
  }
`;
