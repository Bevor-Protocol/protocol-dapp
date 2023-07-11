"use client";

import { styled } from "styled-components";

export const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Logo = styled.div`
  height: 25px;
  aspect-ratio: 2135 / 401;
  position: relative;
`;

export const Nav = styled.div`
  width: 100%;
  padding: var(--padding-screen);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 30px;
`;

export const NavItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

export const NavItem = styled.div<{ $active: boolean }>`
  position: relative;
  opacity: ${(props): number => (props.$active ? 0.5 : 1)};
  transition: opacity 0.25s ease-in-out;

  &:hover {
    opacity: 0.5;
  }

  & svg {
    position: absolute;
    top: 0;
    right: -12px;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--padding-screen);
  padding-top: 30px;
  padding-bottom: 30px;
  row-gap: 1rem;
  text-align: center;
  position: relative;

  & p {
    font-size: 0.85em;
    line-height: 1em;
    opacity: 0.5;
  }

  & .copy {
    font-size: 0.8em;
    line-height: 0.85em;
  }
`;

export const FooterItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;

  & > a {
    opacity: 0.5;
    transition: opacity 0.25s ease-in-out;
  }
  & > a:hover {
    opacity: 0.75;
  }
`;
