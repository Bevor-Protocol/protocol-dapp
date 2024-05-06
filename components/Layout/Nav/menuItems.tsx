"use client";

import { usePathname } from "next/navigation";

import DynamicLink from "@/components/Link";
import { Arrow, Twitter, Discord, Github } from "@/assets";
import { Social } from "@/components/Icon";
import { Row, HoverItem, Column } from "@/components/Box";
import { Ellipses } from "@/components/Items";
import * as Dropdown from "@/components/Dropdown";
import * as Card from "@/components/Card";
import { cn } from "@/lib/utils";

export const NavDashboard = ({ address }: { address: string }): JSX.Element => {
  const pathname = usePathname();

  return (
    <DynamicLink href={address ? `/user/${address}` : "/"}>
      <HoverItem className="h-12 px-2">
        <span
          className={cn(
            (pathname.split("/")[1] != "user" || pathname.split("/")[2] != address) &&
              "opacity-disable",
          )}
        >
          dashboard
        </span>
      </HoverItem>
    </DynamicLink>
  );
};

export const NavMenuItems = (): JSX.Element => {
  const pathname = usePathname();
  return (
    <>
      <DynamicLink href="/leaderboard">
        <HoverItem className="h-12 px-2">
          <span className={cn(pathname !== "leaderboard" && "opacity-disable")}>leaderboard</span>
        </HoverItem>
      </DynamicLink>
      <DynamicLink href="/audits">
        <HoverItem className="h-12 px-2">
          <span className={cn(pathname !== "audits" && "opacity-disable")}>audits</span>
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
      <Dropdown.Content className="top-full right-0">
        <Card.Main
          className={cn(
            "cursor-default text-sm min-w-52 px-2 py-2 gap-2",
            "md:text-base md:top-[unset] md:-right-5 md:bottom-full md:w-svw md:rounded-t-lg",
          )}
        >
          <Column className="items-stretch gap-1">
            <DynamicLink href="/dao">
              <HoverItem className="justify-start px-2 py-1 gap-1">
                <span className="opacity-disable">Governance</span>
                <Arrow fill="white" height={10} width={10} className="opacity-disable" />
              </HoverItem>
            </DynamicLink>
            <DynamicLink href="https://docs.bevor.io">
              <HoverItem className="justify-start px-2 py-1 gap-1">
                <span className="opacity-disable">Documentation</span>
                <Arrow fill="white" height={10} width={10} className="opacity-disable" />
              </HoverItem>
            </DynamicLink>
          </Column>
          <hr className="w-auto h-[1px] border-gray-200/20" />
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
        </Card.Main>
      </Dropdown.Content>
    </Dropdown.Main>
  );
};
