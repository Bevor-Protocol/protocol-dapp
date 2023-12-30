"use client";

import styled, { css, CSSProp, keyframes } from "styled-components";
import { getBreakpoint } from "@/theme";

export const CommonPad = css`
  padding: ${({ theme }): string => theme.mainPadLarge};

  ${getBreakpoint(
    "xs",
    css`
      padding: ${({ theme }): string => theme.mainPadSmall};
    `,
  )}
`;

export const hoverBg = css`
  transition: background-color ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    background-color: ${({ theme }): string => theme.cardBgHover};
  }
`;

export const hoverBorder = css`
  transition: border ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    border: 1px solid ${({ theme }): number => theme.greyBorder};
    outline: none;
  }
`;

export const hoverBrighten = css`
  transition: filter ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    filter: brightness(1.4);
  }
`;

export const focusBorder = css`
  transition: border ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:focus-visible {
    border: 1px solid ${({ theme }): number => theme.greyBorder};
    outline: none;
  }
`;

export const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Section = styled.div<{
  $centerV?: boolean;
  $centerH?: boolean;
  $fillHeight?: boolean;
  $padCommon?: boolean;
}>`
  display: flex;
  flex-direction: column;
  ${({ $centerV }): CSSProp =>
    $centerV &&
    css`
      justify-content: center;
    `}
  ${({ $centerH }): CSSProp =>
    $centerH &&
    css`
      align-items: center;
    `}
  ${({ $fillHeight }): CSSProp =>
    $fillHeight &&
    css`
      min-height: 100vh;
    `}
  ${({ $padCommon }): CSSProp => $padCommon && CommonPad}
`;

export const HR = styled.div<{ $width?: string; $margin?: string }>`
  width: ${({ $width }): string => $width ?? "100%"};
  margin: ${({ $margin }): string => $margin ?? "0"};
  height: 1px;
  background: ${({ theme }): string => theme.greyBorder};
`;

const EllipsesHolder = styled.div<{ $gap?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }): string => $gap ?? "7px"};
`;

const EllipsesDot = styled.div<{ $size?: string }>`
  height: ${({ $size }): string => $size ?? "5px"};
  width: ${({ $size }): string => $size ?? "5px"};
  background-color: currentColor;
  border-radius: 100%;
  position: relative;
`;

export const Ellipsis = ({ size, gap }: { size?: string; gap?: string }): JSX.Element => {
  return (
    <EllipsesHolder $gap={gap}>
      <EllipsesDot $size={size} />
      <EllipsesDot $size={size} />
      <EllipsesDot $size={size} />
    </EllipsesHolder>
  );
};

const spin = keyframes`
  0% {transform: rotate(0deg);}
  100% {transform: rotate(-360deg);}
`;

export const Loader = styled.div<{ $size: string }>`
  height: ${({ $size }): string => $size};
  width: ${({ $size }): string => $size};
  z-index: 0;
  animation: ${spin} 1.25s linear infinite;
  background: conic-gradient(white, transparent);
  padding: 3px;
  border-radius: 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
`;
