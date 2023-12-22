import Link from "next/link";
import styled, { css } from "styled-components";

import { focusBorder } from "@/components/Common";

const LinkStyle = css`
  appearance: none;
  color: inherit;
  text-decoration: none;
  font-family: inherit !important;
  border: 1px solid transparent;
  border-radius: 10px;

  ${focusBorder};
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
