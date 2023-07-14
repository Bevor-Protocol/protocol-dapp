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
}>`
  display: flex;
  flex-direction: row;
  gap: ${({ theme, $gap }): string => $gap && theme.gaps[$gap]};
  flex-wrap: ${({ $wrap }): string => ($wrap ? "wrap" : "nowrap")};
  align-items: ${({ $align }): string => $align ?? "center"};
  justify-content: ${({ $justify }): string => $justify ?? "center"};
`;

export const Column = styled.div<{
  $gap?: string;
  $wrap?: boolean;
  $align?: string;
  $justify?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $gap }): string => $gap && theme.gaps[$gap]};
  flex-wrap: ${({ $wrap }): string => ($wrap ? "wrap" : "nowrap")};
  align-items: ${({ $align }): string => $align ?? "center"};
  justify-content: ${({ $justify }): string => $justify ?? "center"};
`;
