"use client";

import styled, { css, CSSProp } from "styled-components";
import { getBreakpoint } from "@/theme";

export const ToolTip = styled.div`
  position: absolute;
  display: none;
  font-size: 14px;
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
  background: ${({ theme }): string => theme.primaryMix20};
  padding: 4px 10px;
  transform: translateX(-25%);
  border: 1px solid ${({ theme }): string => theme.greyBorder};
`;

export const DropDown = styled.div<{ $top?: string; $flipMobile?: boolean }>`
  position: absolute;
  top: ${({ $top }): string => $top ?? "100%"};
  right: 0;
  background: ${({ theme }): string => theme.bg};
  border: 1px solid ${({ theme }): string => theme.greyBorder};
  border-radius: 10px;
  z-index: 1000;
  cursor: default;
  font-size: 0.8rem;
  min-width: 200px;

  ${({ $flipMobile }): CSSProp =>
    $flipMobile &&
    getBreakpoint(
      "md",
      css`
        font-size: 1rem;
        top: unset;
        right: -20px;
        bottom: 100%;
        width: 100vw;
        border-radius: 10px 10px 0 0;
      `,
    )}
`;
