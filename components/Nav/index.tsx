"use client";

import styled from "styled-components";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

import { Arrow } from "@/assets";
import { navItems } from "@/utils/constants";

import SmartLink from "@/components/Link";
import { Logo } from "@/components/Icon";
import { Row } from "@/components/Box";
import { CommonPad } from "@/components/Common";

const Nav = styled(Row)`
  ${CommonPad};
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
`;

const NavItem = styled.div<{ $active: boolean }>`
  position: relative;
  opacity: ${({ $active, theme }): number =>
    $active ? theme.opacity.disable : theme.opacity.enabled};
  transition: opacity 0.25s ease-in-out;

  &:hover {
    opacity: ${({ theme }): number => theme.opacity.disable};
  }

  & svg {
    position: absolute;
    top: 0;
    right: -12px;
  }
`;

export default (): JSX.Element => {
  const pathname = usePathname();
  return (
    <nav>
      <Nav $justify="space-between">
        <SmartLink external={false} href="/">
          <Logo $height="25px">
            <Image src="/name.png" alt="brand name" fill={true} sizes="any" />
          </Logo>
        </SmartLink>
        <Row $gap="lg">
          {navItems.map((item, ind) => (
            <SmartLink external={item.external} href={item.url} key={ind}>
              <NavItem $active={pathname === item.url}>
                {item.text}
                {item.external && <Arrow fill="white" height={10} width={10} />}
              </NavItem>
            </SmartLink>
          ))}
          <ConnectButton
            label="connect"
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </Row>
      </Nav>
    </nav>
  );
};
