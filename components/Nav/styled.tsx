"use client";

import styled, { css } from "styled-components";

import { Row } from "@/components/Box";
import { CommonPad, hoverBg, focusBorder } from "@/components/Common";
import { getBreakpoint } from "@/theme";

export const Nav = styled(Row)`
  ${CommonPad}
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
  ${getBreakpoint(
    "md",
    css`
      padding-top: 15px;
      padding-bottom: 15px;
    `,
  )}
`;

export const NavItems = styled(Row)`
  ${getBreakpoint(
    "md",
    css`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: ${({ theme }): string => theme.bg};
      z-index: 999;
      border-radius: 10px 10px 0 0;
      justify-content: space-between;
      gap: 0;
      padding-left: 20px;
      padding-right: 20px;
      box-shadow: ${({ theme }): string => theme.boxShadow};
    `,
  )}
  ${getBreakpoint(
    "sm",
    css`
      font-size: 0.9rem;
    `,
  )}
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
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;

  ${hoverBg}
  ${focusBorder}

  ${getBreakpoint(
    "xl",
    css`
      & > span {
        display: none;
      }
    `,
  )}
`;
