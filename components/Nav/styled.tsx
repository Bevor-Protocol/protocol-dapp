"use client";

import styled, { CSSProp } from "styled-components";

import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { CommonPad, hoverBg, hoverBorder, hoverBrighten } from "@/components/Common";

export const Nav = styled(Row)`
  ${CommonPad}
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
`;

export const NavItem = styled(Row)<{
  $active: boolean;
  $hover?: string;
  $border?: string;
  $height?: string;
  $pad?: string;
}>`
  height: ${({ $height }): string => $height ?? "3rem"};
  padding: ${({ $pad }): string => $pad ?? "0 10px"};
  background-color: transparent;
  border: 1px solid transparent;
  width: 100%;
  border-radius: ${({ $border }): string => $border ?? "10px"};
  position: relative;

  & * {
    opacity: ${({ $active, theme }): number =>
      $active ? theme.opacity.enabled : theme.opacity.disable};
  }

  ${({ $hover }): CSSProp => $hover === "bg" && hoverBg};
  ${({ $hover }): CSSProp => $hover === "border" && hoverBorder};
  ${({ $hover }): CSSProp => $hover === "bright" && hoverBrighten};
`;

export const MenuHolder = styled(Row)`
  position: relative;
  cursor: pointer;
`;

export const NetworkHolder = styled(Button)<{ $invalid: boolean }>`
  padding: 7px 10px;
  border: 1px solid ${({ $invalid }): string => ($invalid ? "#dc3545" : "transparent")};
  background: transparent;

  transition: all ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:disabled {
    cursor: default;
    opacity: ${({ theme }): number => theme.opacity.disable};
  }
  &:not(:disabled):hover,
  &:not(:disabled):focus,
  &:not(:disabled):active {
    opacity: ${({ theme }): number => theme.opacity.hover};
    border: 1px solid ${({ theme, $invalid }): number => ($invalid ? "#dc3545" : theme.greyBorder)};
  }

  & img {
    border-radius: 100%;
    height: 1.25rem;
    width: 1.25rem;
  }
`;

export const WalletHolder = styled(Row)`
  padding: 7px 10px;
  border: 1px solid transparent;
  background-color: transparent;
  color: ${({ theme }): string => theme.textPrimary};
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;

  ${hoverBorder}
`;
