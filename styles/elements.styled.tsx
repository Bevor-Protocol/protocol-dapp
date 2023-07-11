"use client";

import { styled } from "styled-components";

export const Button = styled.button<{ $light: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  background: ${(props): string => (props.$light ? "var(--text-light)" : "var(--text-dark)")};
`;
