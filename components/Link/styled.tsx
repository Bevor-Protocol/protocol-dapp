import Link from "next/link";
import styled, { css } from "styled-components";

const LinkStyle = css`
  appearance: none;
  color: inherit;
  text-decoration: none;
  font-family: inherit !important;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid ${({ theme }): string => theme.greyBorder};
    border-radius: 10px;
  }
`;

export const StyledNextLink = styled(Link)`
  ${LinkStyle}
`;

export const StyledLink = styled.a`
  ${LinkStyle}
`;
