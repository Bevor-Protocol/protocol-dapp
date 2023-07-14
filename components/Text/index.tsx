"use client";

import styled, { CSSProp, css } from "styled-components";

export const TextGrad = css`
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 5px 5px 10px ${({ theme }): string => theme.darkShadow};
`;

export const TextGradLight = css`
  background: ${({ theme }): string => theme.textGradLight};
  ${TextGrad}
`;

export const TextGradDark = css`
  background: ${({ theme }): string => theme.textGradDark};
  ${TextGrad}
`;

export const P = styled.p<{ $gradient?: boolean }>`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  ${({ $gradient }): CSSProp => $gradient && TextGradLight};
`;

export const H1 = styled.h1<{ $gradient?: boolean }>`
  font-size: 3.75rem;
  font-weight: 700;
  ${({ $gradient }): CSSProp => $gradient && TextGradLight};

  @media screen and (max-width: ${({ theme }): string => theme.breakpoints.xl}px) {
    font-size: 3rem;
  }
`;

export const H2 = styled.h2<{ $gradient?: boolean }>`
  font-size: 1.5rem;
  font-weight: 900;
  ${({ $gradient }): CSSProp => $gradient && TextGradLight};
`;

export const H3 = styled.h3<{ $gradient?: boolean }>`
  font-size: 1.125rem;
  line-height: 1.15rem;
  font-weight: 800;
  ${({ $gradient }): CSSProp => $gradient && TextGradLight};
`;

export const Span = styled.span<{ $gradient?: boolean }>`
  ${({ $gradient }): CSSProp => $gradient && TextGradDark};
`;
