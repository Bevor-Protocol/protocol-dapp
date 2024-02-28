"use client";

import Link from "next/link";
import styled from "styled-components";

import { focusBorder } from "@/components/Common";

export const StyledNextLink = styled(Link)<{ $disabled?: boolean }>`
  appearance: none;
  color: inherit;
  text-decoration: none;
  font-family: inherit !important;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: ${({ $disabled }): string => ($disabled ? "default" : "pointer")};
  pointer-events: ${({ $disabled }): string => ($disabled ? "none" : "all")};

  & > * {
    opacity: ${({ theme, $disabled }): number => ($disabled ? theme.opacity.disable : 1)};
  }

  & > *:hover {
    opacity: ${({ theme, $disabled }): number => !$disabled && theme.opacity.hover};
  }

  ${focusBorder};
`;

type PropsI = {
  children: React.ReactNode;
  disabled?: boolean;
  href: string;
};

const DynamicLink = ({ children, disabled, href }: PropsI): JSX.Element => {
  const regex = /^(http|https):\/\//;
  const isExternal = regex.test(href);

  return (
    <StyledNextLink
      href={href}
      $disabled={disabled}
      passHref={isExternal}
      target={isExternal ? "_blank" : ""}
      referrerPolicy={isExternal ? "no-referrer" : ""}
    >
      {children}
    </StyledNextLink>
  );
};

export default DynamicLink;
