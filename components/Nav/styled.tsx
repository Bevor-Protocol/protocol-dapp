"use client";

import styled from "styled-components";

import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
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
  &:focus,
  &:active,
  &:focus-visible {
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

export const NetworkHolder = styled(Button)<{ $invalid: boolean }>`
  padding: 7px 15px;
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

export const AddressHolder = styled(Button)<{ $active: boolean }>`
  padding: 7px 15px;
  border: 1px solid transparent;
  color: ${({ $active, theme }): string => ($active ? theme.textPrimary : theme.textBlack)};
  background: ${({ $active, theme }): string => ($active ? "transparent" : theme.textGradLight)};

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
    border: 1px solid ${({ theme }): number => theme.greyBorder};
  }
`;
