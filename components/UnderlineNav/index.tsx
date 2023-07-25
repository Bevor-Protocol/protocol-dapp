"use client";

import styled from "styled-components";

import { Arrow } from "@/assets";
import { auditNavItems } from "@/utils/constants";

import { Row } from "@/components/Box";

import { Dispatch, SetStateAction } from "react";

type Props = {
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
};

const Nav = styled(Row)`
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
`;

const NavItem = styled.div<{ $active: boolean }>`
  position: relative;
  opacity: ${({ $active, theme }): number =>
    $active ? theme.opacity.enabled : theme.opacity.disable};
  cursor: pointer;

  border-bottom: ${({ $active }): string => ($active ? "2px solid white" : "0px")};

  &:hover {
    opacity: ${({ theme }): number => theme.opacity.enabled};
    transition: opacity 0.25s ease-in-out;
  }

  & svg {
    position: absolute;
    top: 0;
    right: -12px;
  }
`;

export default ({ index, setIndex }: Props): JSX.Element => {
  return (
    <nav>
      <Nav $justify="space-between">
        <Row $gap="lg">
          {auditNavItems.map((item, ind) => (
            <NavItem onClick={(): void => setIndex(ind)} $active={index === ind}>
              {item.text}
              {item.external && <Arrow fill="white" height={10} width={10} />}
            </NavItem>
          ))}
        </Row>
      </Nav>
    </nav>
  );
};
