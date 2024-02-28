"use client";

import styled from "styled-components";

import { Column, Row } from "@/components/Box";

export const AuditHolder = styled(Column)`
  width: min(100%, 1000px);
  height: 100%;
`;

export const AuditNav = styled.div<{ $active: boolean }>`
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  opacity: ${({ theme, $active }): number => ($active ? 1 : theme.opacity.disable)};
  transition: opacity ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    opacity: ${({ theme, $active }): number => !$active && theme.opacity.hover};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${({ $active }): string => ($active ? "currentcolor" : "transparent")};
  }
`;

export const AuditFooter = styled(Row)`
  border-top: 1px solid ${({ theme }): string => theme.greyBorder};
`;

export const Auditor = styled.div<{ $offset: string }>`
  height: fit-content;
  width: fit-content;
  position: relative;
  transform: ${({ $offset }): string => `translateX(${$offset})`};
  transition: transform ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};
`;

export const AuditorWrapper = styled(Row)`
  & span {
    margin-right: 10px;
  }

  &:hover ${Auditor} {
    transform: translateX(0);
  }
`;
