import Link from "next/link";
import styled, { css } from "styled-components";

const LinkStyle = css`
  appearance: none;
  color: inherit;
  text-decoration: none;
  font-family: inherit !important;

  &:focus-visible {
    outline: 1px solid ${({ theme }): string => theme.greyBorder};
    border-radius: 10px;
  }
`;

export const StyledNextLink = styled(Link)<{ $disabled?: string }>`
  ${LinkStyle}
  cursor: ${({ $disabled }): string => ($disabled ? "default" : "pointer")};
  pointer-events: ${({ $disabled }): string => ($disabled ? "none" : "all")};
`;

export const StyledLink = styled.a<{ $disabled?: string }>`
  ${LinkStyle}
  cursor: ${({ $disabled }): string => ($disabled ? "default" : "pointer")};
  pointer-events: ${({ $disabled }): string => ($disabled ? "none" : "all")};
`;
