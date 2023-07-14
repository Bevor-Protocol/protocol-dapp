import Link from "next/link";
import styled, { css } from "styled-components";

const LinkStyle = css`
  appearance: none;
  color: inherit;
  text-decoration: none;
  font-family: inherit !important;
  cursor: pointer;

  :active,
  :focus {
    outline: none;
    border: none;
  }
`;

export const StyledNextLink = styled(Link)`
  ${LinkStyle}
`;

export const StyledLink = styled.a`
  ${LinkStyle}
`;
