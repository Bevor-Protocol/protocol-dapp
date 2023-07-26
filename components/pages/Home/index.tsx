"use client";

import styled, { css } from "styled-components";

import { getBreakpoint } from "@/theme";
import { Grid, Column, Row } from "@/components/Box";
import { hoverBrighten } from "@/components/Common";

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
`;

export const HomeStat = styled(Row)`
  background-color: ${({ theme }): string => theme.cardBg};
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  filter: brightness(1);

  ${hoverBrighten}
`;
