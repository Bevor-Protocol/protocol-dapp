"use client";

import Image from "next/image";
import { useRef, useReducer } from "react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

import { Arrow, Twitter, Discord, Github } from "@/assets";
import { navItems } from "@/lib/constants";
import { Span } from "@/components/Text";
import DynamicLink from "@/components/Link";
import { LogoIcon } from "@/components/Icon";
import { Row, Column } from "@/components/Box";
import { Ellipsis, HR } from "@/components/Common";
import { DropDown } from "@/components/Tooltip";
import { Nav, NavItem, NavItems, MenuHolder } from "./styled";
import { useClickOutside } from "@/hooks/useClickOutside";
import Connector from "./web3";
import Dashboard from "./dashboard";

const NavHolder = (): JSX.Element => {
  const pathname = usePathname();
  const { address } = useAccount();
  const [show, setShow] = useReducer((s) => !s, false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, show ? setShow : undefined);

  return (
    <nav>
      <Nav $justify="space-between">
        <Row $gap="lg">
          <DynamicLink href="/">
            <LogoIcon $height="65px">
              <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
            </LogoIcon>
          </DynamicLink>
          <NavItems $gap="sm">
            <Dashboard
              active={pathname.split("/")[1] == "user" && pathname.split("/")[2] == address}
            />
            {navItems.main.map((item, ind) => (
              <DynamicLink href={item.url} key={ind}>
                <NavItem $active={pathname === item.url}>
                  <Span>{item.text}</Span>
                </NavItem>
              </DynamicLink>
            ))}
            <MenuHolder ref={ref} tabIndex={0}>
              <NavItem onClick={setShow} $active={show}>
                <Ellipsis />
              </NavItem>
              {show && (
                <DropDown $flipMobile>
                  <Column $gap="sm" $padding="5px 10px" $align="initial">
                    <Column $align="stretch" $gap="sm">
                      {navItems.dropdown.map((item, ind) => (
                        <DynamicLink href={item.url} key={ind}>
                          <NavItem
                            $height="fit-content"
                            $justify="flex-start"
                            $gap="xs"
                            $active={false}
                            $padding="5px 10px"
                          >
                            <Span>{item.text}</Span>
                            <Arrow fill="white" height={10} width={10} />
                          </NavItem>
                        </DynamicLink>
                      ))}
                    </Column>
                    <HR $width="auto" $margin="0 10px" />
                    <Row $gap="xs" $padding="0 3px" $justify="flex-start">
                      <DynamicLink href="https://twitter.com/BevorProtocol">
                        <NavItem
                          $padding="7px"
                          $border="100%"
                          $active={false}
                          $height="fit-content"
                        >
                          <Twitter height="1rem" width="1rem" fill="white" />
                        </NavItem>
                      </DynamicLink>
                      <DynamicLink href="https://github.com/Bevor-Protocol">
                        <NavItem
                          $padding="7px"
                          $border="100%"
                          $active={false}
                          $height="fit-content"
                        >
                          <Github height="1rem" width="1rem" fill="white" />
                        </NavItem>
                      </DynamicLink>
                      <DynamicLink href="https://discord.gg/MDfNgatN">
                        <NavItem
                          $padding="7px"
                          $border="100%"
                          $active={false}
                          $height="fit-content"
                        >
                          <Discord height="1rem" width="1rem" fill="white" />
                        </NavItem>
                      </DynamicLink>
                    </Row>
                  </Column>
                </DropDown>
              )}
            </MenuHolder>
          </NavItems>
        </Row>
        <Connector />
      </Nav>
    </nav>
  );
};

export default NavHolder;
