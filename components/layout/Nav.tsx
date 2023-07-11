"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

import { Arrow } from "@/assets";
import SmartLink from "@/components/elements/SmartLink";
import * as Styled from "@/styles/layout.styled";
import { navItems } from "@/utils/constants";

export default (): JSX.Element => {
  const pathname = usePathname();
  return (
    <nav>
      <Styled.Nav>
        <SmartLink external={false} href="/">
          <Styled.Logo>
            <Image src="/name.png" alt="brand name" fill={true} sizes="any" />
          </Styled.Logo>
        </SmartLink>
        <Styled.NavItems>
          {navItems.map((item, ind) => (
            <SmartLink external={item.external} href={item.url} key={ind}>
              <Styled.NavItem $active={pathname === item.url}>
                {item.text}
                {item.external && <Arrow fill="white" height={10} width={10} />}
              </Styled.NavItem>
            </SmartLink>
          ))}
          <ConnectButton
            label="connect"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </Styled.NavItems>
      </Styled.Nav>
    </nav>
  );
};
