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
  transition: transform ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  :disabled {
    opacity: ${({ theme }): number => theme.opacity.disable};
  }
  :not(:disabled):hover {
    transform: scale(1.05);
  }
`;

export const ButtonLight = styled(Button)`
  background: ${({ theme }): string => theme.textGradLight};
`;

export const ButtonDark = styled(Button)`
  background: ${({ theme }): string => theme.textGradDark};
`;

export const ButtonContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;
