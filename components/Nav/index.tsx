"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

import { Arrow } from "@/assets";
import { navItems } from "@/utils/constants";

import SmartLink from "@/components/Link";
import { LogoIcon } from "@/components/Icon";
import { Row } from "@/components/Box";
import { Nav, NavItem } from "./styled";
import Dropdown from "./Dropdown";

export default (): JSX.Element => {
  const pathname = usePathname();
  return (
    <nav>
      <Nav $justify="space-between">
        <Row $gap="lg">
          <SmartLink external={false} href="/">
            <LogoIcon $height="65px">
              <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
            </LogoIcon>
          </SmartLink>
          <Row $gap="lg">
            {navItems.main.map((item, ind) => (
              <SmartLink external={false} href={item.url} key={ind}>
                <NavItem $active={pathname === item.url} $pad="15px">
                  {item.text}
                </NavItem>
              </SmartLink>
            ))}
            <Dropdown>
              {navItems.dropdown.map((item, ind) => (
                <SmartLink external={true} href={item.url} key={ind}>
                  <NavItem $active={pathname === item.url} $justify="flex-start">
                    {item.text}
                    <Arrow fill="white" height={10} width={10} />
                  </NavItem>
                </SmartLink>
              ))}
            </Dropdown>
          </Row>
        </Row>
        <Row>
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
