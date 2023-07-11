"use client";

import { styled } from "styled-components";

// Home

export const Home = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 40px;
  row-gap: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media screen and (max-width: 730px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
  }
`;

export const HomeText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 30px;
`;

export const HomeButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;

  & div {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
`;

export const HomeStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 5px;

  & > div {
    background-color: var(--card-bg);
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.25s ease-in-out;
  }

  & > div:hover {
    filter: brightness(1.4);
  }

  @media screen and (max-width: 1074px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }

  @media screen and (max-width: 730px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  @media screen and (max-width: 497px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
`;

// Audits

export const AuditMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

export const AuditSection = styled.div`
  width: 100%;
  margin: 2rem;

  & h2 {
    margin-bottom: 1rem;
  }
`;

export const AuditGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

export const Audit = styled.div`
  background: var(--card-bg);
  border-radius: 10px;
  border: 2px solid #565266;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AuditContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2rem;
  align-items: flex-start;
  padding: 1rem;

  & :last-child {
    margin-left: auto;
  }

  & .text {
    max-width: 40%;
  }
`;

export const AuditFooter = styled.div<{ $disabled: boolean }>`
  border-top: 1px solid #565266;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
  height: 40px;
  padding: 0 1rem;

  & :last-child {
    margin-left: auto;
  }

  & .competition {
    opacity: ${(props): number => (props.$disabled ? 0.5 : 1)};
  }
`;

export const Icon = styled.div<{ $size: string }>`
  height: ${(props): string =>
    props.$size === "large" ? "75px" : props.$size === "medium" ? "30px" : "25px"};
  width: ${(props): string =>
    props.$size === "large" ? "75px" : props.$size === "medium" ? "30px" : "15px"};
  min-width: ${(props): string =>
    props.$size === "large" ? "75px" : props.$size === "medium" ? "30px" : "15px"};
  margin-right: 0px;
  border-radius: 100%;
  ${(props): any => props.$size !== "small" && "background: white"};
  transition: all 0.25s ease-in-out;
`;

export const AuditAuditors = styled.div`
  display: flex;
  align-items: center;

  & span {
    margin-right: 10px;
  }

  &:hover ${Icon} {
    width: 25px;
    margin-right: 5px;
  }
`;

export const AuditTooltip = styled.div`
  position: absolute;
  display: none;
  font-size: 14px;
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
  background: var(--card-bg);
  padding: 4px 10px;
  transform: translateX(-25%);
  border: 1px solid #565266;
`;

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
