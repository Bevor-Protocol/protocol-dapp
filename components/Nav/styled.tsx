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
  transition: opacity 0.25s ease-in-out;

  &:hover,
  &:focus {
    opacity: ${({ $active, theme }): number => !$active && theme.opacity.disable};
  }
`;

export const MenuHolder = styled(Row)`
  position: relative;
  cursor: pointer;
  width: 30px;
  height: 35px;
`;

export const MenuDots = styled.div`
  height: 5px;
  width: 5px;
  background-color: currentColor;
  border-radius: 100%;
  position: relative;

  &:before {
    content: "";
    height: 5px;
    width: 5px;
    background-color: currentColor;
    position: absolute;
    left: 10px;
    border-radius: 100%;
  }

  &:after {
    content: "";
    height: 5px;
    width: 5px;
    background-color: currentColor;
    position: absolute;
    right: 10px;
    border-radius: 100%;
  }
`;
