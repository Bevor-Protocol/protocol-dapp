"use client";

import styled, { css } from "styled-components";
import { hoverBg } from "@/components/Common";
import { Column } from "@/components/Box";
import { getBreakpoint } from "@/theme";

export const LeadGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  appearance: none;
  list-style: none;
  margin: 0;
  padding: 10px;

  &:nth-child(n + 2) {
    margin: 7px 0;
  }

  & > :nth-child(1) {
    grid-column: 1 / 5;
  }
  & > :nth-child(2) {
    grid-column: 5 / 7;
  }
  & > :nth-child(3) {
    grid-column: 7 / 9;
  }
  & > :nth-child(4) {
    grid-column: 9 / 11;
  }
  & > :nth-child(5) {
    grid-column: 11 / 13;
  }
`;

export const Leaderboard = styled(Column)`
  position: relative;
  max-height: none;
  width: min(100%, 1000px);
  padding: 2rem 0;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }): string => theme.primaryMix10};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }): string => theme.primary10};
    border-radius: 10px;
  }

  ${getBreakpoint(
    "xl",
    css`
      max-height: calc(100vh - (3rem + 60px));
      max-height: calc(100dvh - (3rem + 60px));
      overflow-y: scroll;
      padding: 0;
      display: block;
      margin-top: 2rem;
    `,
  )}

  ${getBreakpoint(
    "lg",
    css`
      overflow-x: scroll;

      & > div {
        min-width: 622px;
      }
    `,
  )}

  ${getBreakpoint(
    "md",
    css`
      max-height: calc(100vh - (3rem + 60px + 3rem));
      max-height: calc(100dvh - (3rem + 60px + 3rem));
    `,
  )}
`;

export const LeadHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background: ${({ theme }): string => theme.bg};
  z-index: 999;
  width: 100%;

  & li {
    cursor: pointer;
    padding: 10px;
    transform: translateX(-10px);
    border-radius: 10px;
    width: fit-content;
    ${hoverBg}
  }
`;

export const LeadData = styled.div`
  & ${LeadGrid} {
    border-radius: 10px;
    background-color: ${({ theme }): string => theme.bg};
    box-shadow: inset ${({ theme }): string => theme.boxShadow};
    ${hoverBg}
  }
`;
