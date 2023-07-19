"use client";

import styled, { css, CSSProp } from "styled-components";

const Grow = css`
  transition: transform ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:not(:disabled):hover,
  &:not(:disabled):focus,
  &:not(:disabled):active {
    transform: scale(1.025);
  }
`;

const Dim = css`
  transition: opacity ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:not(:disabled):hover,
  &:not(:disabled):focus,
  &:not(:disabled):active {
    opacity: ${({ theme }): number => theme.opacity.hover};
  }
`;

export const Button = styled.button<{ $pad?: string; $border?: string }>`
  outline: none;
  border: none;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  padding: ${({ $pad }): string => $pad ?? "10px 20px"};
  border: ${({ $border }): string => $border ?? "none"};
  border-radius: 5px;
  font-size: 0.89rem !important;
  line-height: 1.3rem;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: ${({ theme }): number => theme.opacity.disable};
  }
`;

export const ButtonLight = styled(Button)<{ $hover?: string }>`
  background: ${({ theme }): string => theme.textGradLight};
  color: ${({ theme }): string => theme.textDark};
  ${({ $hover }): CSSProp => ($hover === "dim" ? Dim : Grow)};
`;

export const ButtonDark = styled(Button)<{ $hover?: string }>`
  background: ${({ theme }): string => theme.textGradDark};
  color: ${({ theme }): string => theme.textPrimary};
  ${({ $hover }): CSSProp => ($hover === "dim" ? Dim : Grow)};
`;
