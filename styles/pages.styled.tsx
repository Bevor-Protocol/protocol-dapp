"use client";

import { styled } from "styled-components";

// Leaderboard

export const Leaderboard = styled.div`
  padding: 3rem 0;
  position: relative;
  max-height: none;
  width: min(100%, 1000px);
  margin: auto;
`;

export const LeadHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(5px);

  & li {
    cursor: pointer;
  }
`;

export const LeadGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  appearance: none;
  list-style: none;
  margin: 0;
  padding: 10px 10px;

  &:nth-child(n + 2) {
    margin: 7px 0;
  }

  & li {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  & li span {
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }

  & :nth-child(1) {
    grid-column: 1 / 4;
  }
  & :nth-child(2) {
    grid-column: 4 / 7;
  }
  & :nth-child(3) {
    grid-column: 7 / 9;
  }
  & :nth-child(4) {
    grid-column: 9 / 11;
  }
  & :nth-child(5) {
    grid-column: 11 / 13;
  }
`;

export const LeadData = styled.div`
  margin: 0 10px;

  & ${LeadGrid} {
    background: var(--card-bg);
    border-radius: 10px;
    border: 1px solid #565266;
  }
`;
