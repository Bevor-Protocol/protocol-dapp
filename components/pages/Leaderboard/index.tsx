"use client";

import styled, { css } from "styled-components";
import { hoverBg } from "@/components/Common";
import { Column } from "@/components/Box";
import { getBreakpoint } from "@/theme";

export const Leaderboard = styled(Column)`
  position: relative;
  max-height: none;
  width: min(100%, 1000px);
`;

export const LeadHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 0 10px;
  background: ${({ theme }): string => theme.bg};
  z-index: 999;
  width: 100%;

  & li {
    cursor: pointer;
    padding: 10px;
    transform: translateX(-10px);
    border-radius: 10px;
    ${hoverBg}
  }
`;

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

  & li {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    max-width: 100%;
  }

  & li span {
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }

  & > :nth-child(1) {
    grid-column: 1 / 4;
  }
  & > :nth-child(2) {
    grid-column: 4 / 7;
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

export const LeadData = styled.div`
  margin: 0 10px;

  & ${LeadGrid} {
    border-radius: 10px;
    background-color: ${({ theme }): string => theme.bg};
    box-shadow: inset ${({ theme }): string => theme.boxShadow};
    ${hoverBg}
  }

  ${getBreakpoint(
    "xl",
    css`
      max-height: calc(100vh - (3rem + 60px) - 2rem - (20px + 1.27rem + 20px) - 4px);
      overflow-y: scroll;
    `,
  )}

  ${getBreakpoint(
    "md",
    css`
      max-height: calc(100vh - (3rem + 60px + 3rem) - 2rem - (20px + 1.27rem + 20px) - 4px);
    `,
  )}
`;
