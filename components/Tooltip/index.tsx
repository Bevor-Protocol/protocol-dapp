"use client";

import styled from "styled-components";

export const ToolTip = styled.div`
  position: absolute;
  display: none;
  font-size: 14px;
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
  background: ${({ theme }): string => theme.cardBg};
  padding: 4px 10px;
  transform: translateX(-25%);
  border: 1px solid ${({ theme }): string => theme.greyBorder};
`;

export const DropDown = styled.div<{ $top?: string }>`
  position: absolute;
  top: ${({ $top }): string => $top ?? "100%"};
  right: 0;
  background: ${({ theme }): string => theme.cardBg};
  border: 1px solid ${({ theme }): string => theme.greyBorder};
  border-radius: 10px;
  z-index: 1000;
  cursor: default;
  font-size: 0.8rem;
  min-width: 200px;
`;
