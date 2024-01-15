"use client";

import styled from "styled-components";

export const Grid = styled.div<{ $gap?: string; $align?: string; $justify?: string }>`
  display: grid;
  gap: ${({ theme, $gap }): string => $gap && theme.gaps[$gap]};
  align-items: ${({ $align }): string => $align ?? "center"};
  justify-content: ${({ $justify }): string => $justify ?? "center"};
`;

export const Row = styled.div<{
  $gap?: string;
  $wrap?: boolean;
  $align?: string;
  $justify?: string;
  $padding?: string;
  $margin?: string;
  $width?: string;
}>`
  display: flex;
  flex-direction: row;
  gap: ${({ theme, $gap }): string => $gap && theme.gaps[$gap]};
  flex-wrap: ${({ $wrap }): string => ($wrap ? "wrap" : "nowrap")};
  align-items: ${({ $align }): string => $align ?? "center"};
  justify-content: ${({ $justify }): string => $justify ?? "center"};
  padding: ${({ $padding }): string => $padding ?? "0"};
  margin: ${({ $margin }): string => $margin ?? "0"};
  width: ${({ $width }): string => $width ?? "fit-content"};
`;

export const Column = styled.div<{
  $gap?: string;
  $wrap?: boolean;
  $align?: string;
  $justify?: string;
  $padding?: string;
  $margin?: string;
  $width?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $gap }): string => $gap && theme.gaps[$gap]};
  flex-wrap: ${({ $wrap }): string => ($wrap ? "wrap" : "nowrap")};
  align-items: ${({ $align }): string => $align ?? "center"};
  justify-content: ${({ $justify }): string => $justify ?? "center"};
  padding: ${({ $padding }): string => $padding ?? "0"};
  margin: ${({ $margin }): string => $margin ?? "0"};
  width: ${({ $width }): string => $width ?? "100%"};
`;

export const LiElement = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }): string => theme.gaps.sm};
  padding-right: 10px;
  white-space: nowrap;
  max-width: 100%;

  & span {
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    line-height: 1.27rem;
  }
`;
