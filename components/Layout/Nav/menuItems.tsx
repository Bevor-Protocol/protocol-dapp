"use client";

import { usePathname } from "next/navigation";

import { Arrow, Discord, Github, Twitter } from "@/assets";
import { Column, HoverItem, Row } from "@/components/Box";
import * as Card from "@/components/Card";
import * as Dropdown from "@/components/Dropdown";
import { Social } from "@/components/Icon";
import { Ellipses } from "@/components/Items";
import DynamicLink from "@/components/Link";
import { cn } from "@/utils";

export const NavMenuItems = (): JSX.Element => {
  const pathname = usePathname();
  const route = pathname.split("/")[1];
  return (
    <>
      <DynamicLink href="/users">
        <HoverItem className="h-12 px-2">
          <span className={cn(route !== "users" && "opacity-disable")}>users</span>
        </HoverItem>
      </DynamicLink>
      <DynamicLink href="/audits">
        <HoverItem className="h-12 px-2">
          <span className={cn(route !== "audits" && "opacity-disable")}>audits</span>
        </HoverItem>
      </DynamicLink>
      <DynamicLink href="/leaderboard">
        <HoverItem className="h-12 px-2">
          <span className={cn(route !== "leaderboard" && "opacity-disable")}>leaderboard</span>
        </HoverItem>
      </DynamicLink>
    </>
  );
};

export const NavDropdown = (): JSX.Element => {
  return (
    <Dropdown.Main>
      <Dropdown.Trigger>
        <HoverItem className="focus-border cursor-pointer h-12" tabIndex={0}>
          <Ellipses className="transition-colors text-white/60" />
        </HoverItem>
      </Dropdown.Trigger>
      <Dropdown.Content className="top-full right-0 md:top-[unset] md:-right-5 md:bottom-full md:w-svw">
        <Card.Main className="cursor-default text-sm min-w-52 md:text-base md:rounded-t-lg">
          <Card.Content className="px-2 py-2">
            <Column className="items-stretch gap-1 w-full">
              <DynamicLink href="/dao" className="w-full">
                <HoverItem className="justify-start px-2 py-1 gap-1">
                  <span className="opacity-disable">Governance</span>
                  <Arrow fill="white" height={10} width={10} className="opacity-disable" />
                </HoverItem>
              </DynamicLink>
              <DynamicLink href="https://docs.bevor.io" className="w-full">
                <HoverItem className="justify-start px-2 py-1 gap-1">
                  <span className="opacity-disable">Documentation</span>
                  <Arrow fill="white" height={10} width={10} className="opacity-disable" />
                </HoverItem>
              </DynamicLink>
            </Column>
          </Card.Content>
          <Card.Footer className="px-2 py-1">
            <Row className="gap-1 pl-1">
              <DynamicLink href="https://twitter.com/BevorProtocol">
                <Social>
                  <Twitter height="1rem" width="1rem" fill="white" className="opacity-disable" />
                </Social>
              </DynamicLink>
              <DynamicLink href="https://github.com/Bevor-Protocol">
                <Social>
                  <Github height="1rem" width="1rem" fill="white" className="opacity-disable" />
                </Social>
              </DynamicLink>
              <DynamicLink href="https://discord.gg/MDfNgatN">
                <Social>
                  <Discord height="1rem" width="1rem" fill="white" className="opacity-disable" />
                </Social>
              </DynamicLink>
            </Row>
          </Card.Footer>
        </Card.Main>
      </Dropdown.Content>
    </Dropdown.Main>
  );
};
