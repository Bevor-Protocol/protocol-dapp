"use client";

import styled from "styled-components";

import { Row } from "@/components/Box";
import { CommonPad } from "@/components/Common";

export const Nav = styled(Row)`
  ${CommonPad}
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
`;

export const NavItem = styled(Row)<{ $active: boolean; $pad?: string }>`
  padding-top: ${({ $pad }): string => $pad ?? "0px"};
  padding-bottom: ${({ $pad }): string => $pad ?? "0px"};
  opacity: ${({ $active, theme }): number =>
    $active ? theme.opacity.disable : theme.opacity.enabled};
  transition: opacity ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover,
  &:focus {
    opacity: ${({ $active, theme }): number => !$active && theme.opacity.disable};
  }
`;

export const NavItemBg = styled(Row)<{ $pad?: string; $radius?: string }>`
  padding: ${({ $pad }): string => $pad ?? "0px"};
  width: 100%;
  background-color: ${({ theme }): string => theme.cardBg};
  border-radius: ${({ $radius }): string => $radius ?? "10px"};
  filter: brightness(1);
  transition: filter ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  & * {
    opacity: ${({ theme }): number => theme.opacity.disable};
  }

  &:hover {
    filter: brightness(1.4);
  }
`;

export const MenuHolder = styled(Row)`
  position: relative;
  cursor: pointer;
`;
