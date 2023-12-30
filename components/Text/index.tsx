"use client";

import styled, { css, CSSProp } from "styled-components";
import { getBreakpoint } from "@/theme";

export const TextGrad = css`
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

export const TextGradLight = css`
  background: ${({ theme }): string => theme.textGradLight};
  ${TextGrad}
`;

export const TextGradDark = css`
  background: ${({ theme }): string => theme.textGradDark};
  ${TextGrad}
`;

export const H1 = styled.h1`
  font-size: 3.75rem;
  font-weight: 700;
  ${TextGradLight}

  ${getBreakpoint(
    "xl",
    css`
      font-size: 3rem;
    `,
  )}
`;

export const H2 = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  ${TextGradLight}
`;

export const H3 = styled.h3`
  font-size: 1.125rem;
  line-height: 1.15rem;
  font-weight: 800;
  ${TextGradLight}
`;

export const P = styled.p<{ $secondary?: boolean }>`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${({ $secondary, theme }): string => $secondary && theme.textSecondary};
`;

export const Strong = styled.strong<{ $large?: boolean }>`
  font-size: ${({ $large }): string => ($large ? "1.125rem" : "1rem")};
  line-height: ${({ $large }): string => ($large ? "1.15rem" : "1.5rem")};
  font-weight: 800;
`;

export const Span = styled.span<{ $gradient?: boolean; $secondary?: boolean }>`
  color: ${({ $secondary, theme }): string => $secondary && theme.textSecondary};
  ${({ $gradient }): CSSProp => $gradient && TextGradLight}
  transition: opacity ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};
`;
