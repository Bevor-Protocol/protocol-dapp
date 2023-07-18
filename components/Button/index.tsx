"use client";

import styled, { css } from "styled-components";

export const Grow = css`
  transition: transform ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:not(:disabled):hover,
  &:not(:disabled):focus,
  &:not(:disabled):active {
    transform: scale(1.025);
  }
`;

export const Button = styled.button`
  outline: none;
  border: none;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 0.89rem !important;
  line-height: 1.3rem;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: ${({ theme }): number => theme.opacity.disable};
  }
`;

export const ButtonLight = styled(Button)`
  background: ${({ theme }): string => theme.textGradLight};
  color: ${({ theme }): string => theme.textDark};
  ${Grow}
`;

export const ButtonDark = styled(Button)`
  background: ${({ theme }): string => theme.textGradDark};
  color: ${({ theme }): string => theme.textPrimary};
  ${Grow}
`;
