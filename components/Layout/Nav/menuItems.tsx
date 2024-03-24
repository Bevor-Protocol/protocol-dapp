"use client";

import clsx from "clsx";
import { useRef, useReducer } from "react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

import DynamicLink from "@/components/Link";
import { useIsMounted } from "@/hooks/useIsMounted";
import { navItems } from "@/lib/constants";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Arrow, Twitter, Discord, Github } from "@/assets";
import { Social } from "@/components/Icon";
import { Card } from "@/components/Card";
import { Row, HoverItem, Column } from "@/components/Box";
import { Ellipses } from "@/components/Items";

export const NavDashboard = (): JSX.Element => {
  const pathname = usePathname();
  const mounted = useIsMounted();
  const { address } = useAccount();

  return (
    <DynamicLink href={mounted && address ? `/user/${address}` : "/"}>
      <HoverItem className="h-12 px-2">
        <span
          className={clsx({
            "opacity-disable":
              pathname.split("/")[1] != "user" || pathname.split("/")[2] != address,
          })}
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
      {navItems.main.map((item, ind) => (
        <DynamicLink href={item.url} key={ind}>
          <HoverItem className="h-12 px-2">
            <span
              className={clsx({
                "opacity-disable": pathname !== item.url,
              })}
            >
              {item.text}
            </span>
          </HoverItem>
        </DynamicLink>
      ))}
    </>
  );
};

export const NavDropdown = (): JSX.Element => {
  const [show, setShow] = useReducer((s) => !s, false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, show ? setShow : undefined);

  return (
    <div ref={ref}>
      <HoverItem className="focus-border cursor-pointer h-12" tabIndex={0}>
        <Ellipses
          className={clsx({
            "*:opacity-disable": !show,
          })}
          onClick={setShow}
        />
        {show && (
          <Card
            className={clsx(
              "absolute top-full right-0 z-[999]",
              "cursor-default text-xs min-w-52 px-2 py-2 gap-2",
              "md:text-base md:top-[unset] md:-right-5 md:bottom-full md:w-svw md:rounded-t-lg",
            )}
          >
            <Column className="items-stretch gap-1">
              {navItems.dropdown.map((item, ind) => (
                <DynamicLink href={item.url} key={ind}>
                  <HoverItem className="justify-start px-2 py-1 gap-1">
                    <span className="opacity-disable">{item.text}</span>
                    <Arrow fill="white" height={10} width={10} className="opacity-disable" />
                  </HoverItem>
                </DynamicLink>
              ))}
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
          </Card>
        )}
      </HoverItem>
    </div>
  );
};
