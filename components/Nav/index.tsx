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
import { Nav, NavItem, MenuHolder } from "./styled";
import { useClickOutside } from "@/hooks/useClickOutside";
import Connector from "./web3";
import Dashboard from "./dashboard";

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
          <Row $gap="sm">
            <Dashboard active={pathname.split("/")[1] == "user"} />
            {navItems.main.map((item, ind) => (
              <SmartLink external={false} href={item.url} key={ind}>
                <NavItem $active={pathname === item.url} $hover="bg">
                  <Span>{item.text}</Span>
                </NavItem>
              </SmartLink>
            ))}
            <MenuHolder ref={ref}>
              <NavItem onClick={setShow} $active={show} $hover="bg">
                <Ellipsis />
              </NavItem>
              {show && (
                <DropDown $top="100%">
                  <Column $gap="sm" $padding="5px 10px" $align="initial">
                    <Column $align="stretch" $gap="sm" style={{ width: "100%" }}>
                      {navItems.dropdown.map((item, ind) => (
                        <SmartLink external={true} href={item.url} key={ind}>
                          <NavItem
                            $height="fit-content"
                            $justify="flex-start"
                            $gap="xs"
                            $active={false}
                            $hover="bg"
                            $pad="5px 10px"
                          >
                            <Span>{item.text}</Span>
                            <Arrow fill="white" height={10} width={10} />
                          </NavItem>
                        </SmartLink>
                      ))}
                    </Column>
                    <HR $width="auto" $margin="0 10px" />
                    <Row $gap="xs" $padding="0 3px" $justify="flex-start">
                      <SmartLink href="https://twitter.com/BevorProtocol" external={true}>
                        <NavItem
                          $pad="7px"
                          $border="100%"
                          $active={false}
                          $hover="bg"
                          $height="fit-content"
                        >
                          <Twitter height="0.9rem" width="0.9rem" fill="white" />
                        </NavItem>
                      </SmartLink>
                      <SmartLink href="https://github.com/Bevor-Protocol" external={true}>
                        <NavItem
                          $pad="7px"
                          $border="100%"
                          $active={false}
                          $hover="bg"
                          $height="fit-content"
                        >
                          <Github height="0.9rem" width="0.9rem" fill="white" />
                        </NavItem>
                      </SmartLink>
                      <SmartLink href="https://discord.gg/MDfNgatN" external={true}>
                        <NavItem
                          $pad="7px"
                          $border="100%"
                          $active={false}
                          $hover="bg"
                          $height="fit-content"
                        >
                          <Discord height="0.9rem" width="0.9rem" fill="white" />
                        </NavItem>
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
