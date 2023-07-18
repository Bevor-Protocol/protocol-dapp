"use client";

import styled, { css, CSSProp, keyframes } from "styled-components";
import { getBreakpoint } from "@/theme";
import { EllipsesDot, EllipsesHolder } from "./styled";

export const CommonPad = css`
  padding: ${({ theme }): string => theme.mainPadLarge};

  ${getBreakpoint(
    "xs",
    css`
      padding: ${({ theme }): string => theme.mainPadSmall};
    `,
  )}
`;

export const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export const HR = styled.div<{ $width?: string }>`
  width: ${({ $width }): string => $width ?? "100%"};
  height: 1px;
  background: ${({ theme }): string => theme.greyBorder};
`;

export const Ellipsis = ({
  size,
  gap,
  height,
  fadeOnHover,
  onClick,
}: {
  size?: string;
  gap?: string;
  height?: string;
  fadeOnHover?: boolean;
  onClick?: () => void;
}): JSX.Element => {
  return (
    <EllipsesHolder $gap={gap} $height={height} $fade={fadeOnHover} onClick={onClick}>
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
