"use client";

import Image from "next/image";
import { useRef, useReducer } from "react";
import { usePathname } from "next/navigation";

import { Arrow, Twitter, Discord, Github } from "@/assets";
import { navItems } from "@/utils/constants";

import { Span } from "@/components/Text";
import SmartLink from "@/components/Link";
import { LogoIcon } from "@/components/Icon";
import { Row, Column } from "@/components/Box";
import { Ellipsis, HR } from "@/components/Common";
import { DropDown } from "@/components/Tooltip";
import { Nav, NavItem, MenuHolder, NavItemBg } from "./styled";
import { useClickOutside } from "@/hooks/useClickOutside";
import Connector from "./web3";

export default (): JSX.Element => {
  const pathname = usePathname();
  const [show, setShow] = useReducer((s) => !s, false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, show ? setShow : undefined);

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
            <MenuHolder ref={ref}>
              <Ellipsis height="1.25rem" fadeOnHover={true} onClick={setShow} />
              {show && (
                <DropDown $top="30px">
                  <Column $align="flex-start" $gap="sm">
                    <Column $align="stretch" $gap="sm" style={{ width: "100%" }}>
                      {navItems.dropdown.map((item, ind) => (
                        <SmartLink external={true} href={item.url} key={ind}>
                          <NavItemBg $pad="8px 5px" $justify="flex-start" $gap="xs">
                            <Span>{item.text}</Span>
                            <Arrow fill="white" height={10} width={10} />
                          </NavItemBg>
                        </SmartLink>
                      ))}
                    </Column>
                    <HR />
                    <Row $gap="md">
                      <SmartLink href="https://twitter.com/BevorProtocol" external={true}>
                        <NavItemBg $pad="7px" $radius="100%">
                          <Twitter height="0.9rem" width="0.9rem" fill="white" />
                        </NavItemBg>
                      </SmartLink>
                      <SmartLink href="https://github.com/Bevor-Protocol" external={true}>
                        <NavItemBg $pad="7px" $radius="100%">
                          <Github height="0.9rem" width="0.9rem" fill="white" />
                        </NavItemBg>
                      </SmartLink>
                      <SmartLink href="https://discord.gg/MDfNgatN" external={true}>
                        <NavItemBg $pad="7px" $radius="100%">
                          <Discord height="0.9rem" width="0.9rem" fill="white" />
                        </NavItemBg>
                      </SmartLink>
                    </Row>
                  </Column>
                </DropDown>
              )}
            </MenuHolder>
          </Row>
        </Row>
        <Connector />
      </Nav>
    </nav>
  );
};
