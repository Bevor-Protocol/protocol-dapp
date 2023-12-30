"use client";

import styled from "styled-components";

import { Row } from "@/components/Box";
import { CommonPad, hoverBg, focusBorder } from "@/components/Common";

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
  ${hoverBg}
`;

export const MenuHolder = styled(Row)`
  position: relative;
  cursor: pointer;
`;

export const WalletHolder = styled(Row)`
  padding: 7px 10px;
  border: 1px solid transparent;
  background-color: transparent;
  color: ${({ theme }): string => theme.textPrimary};
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;

  ${hoverBg}
  ${focusBorder}
`;
