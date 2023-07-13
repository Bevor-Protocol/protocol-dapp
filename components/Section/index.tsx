"use client";

import styled, { CSSProp, css } from "styled-components";
import { CommonPad } from "@/components/Common";

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
