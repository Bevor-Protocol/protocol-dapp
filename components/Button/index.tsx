"use client";

import styled from "styled-components";

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
  transition: transform ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:disabled {
    cursor: default;
    opacity: ${({ theme }): number => theme.opacity.disable};
  }
  &:not(:disabled):hover {
    transform: scale(1.025);
  }
`;

export const ButtonLight = styled(Button)`
  background: ${({ theme }): string => theme.textGradLight};
`;

export const ButtonDark = styled(Button)`
  background: ${({ theme }): string => theme.textGradDark};
`;
