"use client";

import Image from "next/image";
import { useRef, useReducer } from "react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

import { Arrow, Twitter, Discord, Github } from "@/assets";
import { navItems } from "@/lib/constants";
import DynamicLink from "@/components/Link";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useIsMounted } from "@/hooks/useIsMounted";
import Connector from "./web3";
import clsx from "clsx";

const NavHolder = (): JSX.Element => {
  const pathname = usePathname();
  const { address } = useAccount();
  const mounted = useIsMounted();
  const [show, setShow] = useReducer((s) => !s, false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, show ? setShow : undefined);

  return (
    <nav className="px-screen py-6 w-full flex flex-row justify-between items-center md:py-4">
      <div className="flex flex-row gap-6">
        <DynamicLink href="/">
          <div className="aspect-[1091/1685] relative h-16">
            <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
          </div>
        </DynamicLink>
        <div className="flex flex-row gap-2 items-center sm:nav-fixed-bottom sm:text-sm">
          <DynamicLink href={mounted && address ? `/user/${address}` : "/"}>
            <div
              className="flex flex-row justify-center items-center relative h-12 rounded-lg
              px-2 transition-colors hover:bg-dark-primary-30"
            >
              <span
                className={clsx({
                  "opacity-disable":
                    pathname.split("/")[1] != "user" || pathname.split("/")[2] != address,
                })}
              >
                dashboard
              </span>
            </div>
          </DynamicLink>
          {navItems.main.map((item, ind) => (
            <DynamicLink href={item.url} key={ind}>
              <div
                className="flex flex-row justify-center items-center relative h-12 rounded-lg
              px-2 transition-colors hover:bg-dark-primary-30"
              >
                <span
                  className={clsx({
                    "opacity-disable": pathname !== item.url,
                  })}
                >
                  {item.text}
                </span>
              </div>
            </DynamicLink>
          ))}
          <div
            className={clsx(
              "flex flex-row relative cursor-pointer rounded-lg focus-border",
              "justify-center items-center h-12 hover:bg-dark-primary-30",
            )}
            ref={ref}
            tabIndex={0}
          >
            <div
              className={clsx("flex px-2 items-center justify-center h-full w-full", {
                "*:opacity-disable": !show,
              })}
              onClick={setShow}
            >
              <div className="flex items-center justify-center gap-[7px]">
                <div className="h-[5px] w-[5px] bg-current rounded-full relative"></div>
                <div className="h-[5px] w-[5px] bg-current rounded-full relative"></div>
                <div className="h-[5px] w-[5px] bg-current rounded-full relative"></div>
              </div>
            </div>
            {show && (
              <div
                className={clsx(
                  "absolute top-full right-0 bg-dark border border-gray-200/20 rounded-lg z-[999]",
                  "cursor-default text-xs min-w-52",
                  "md:text-base md:top-[unset] md:-right-5 md:bottom-full md:w-svw md:rouned-t-lg",
                )}
              >
                <div className="flex flex-col px-2 py-2 gap-2">
                  <div className="flex flex-col items-stretch gap-1">
                    {navItems.dropdown.map((item, ind) => (
                      <DynamicLink href={item.url} key={ind}>
                        <div
                          className="flex flex-row justify-start items-center relative rounded-lg
              px-2 py-1 gap-1 border border-transparent transition-colors hover:bg-dark-primary-30"
                        >
                          <span className="opacity-disable">{item.text}</span>
                          <Arrow fill="white" height={10} width={10} className="opacity-disable" />
                        </div>
                      </DynamicLink>
                    ))}
                  </div>
                  <hr className="w-auto h-[1px] border-gray-200/20" />
                  <div className="flex flex-row gap-1 pl-1">
                    <DynamicLink href="https://twitter.com/BevorProtocol">
                      <div
                        className="flex justify-center items-center relative rounded-full
              p-1 border border-transparent transition-colors hover:bg-dark-primary-30"
                      >
                        <Twitter
                          height="1rem"
                          width="1rem"
                          fill="white"
                          className="opacity-disable"
                        />
                      </div>
                    </DynamicLink>
                    <DynamicLink href="https://github.com/Bevor-Protocol">
                      <div
                        className="flex justify-center items-center relative rounded-full
              p-1 border border-transparent transition-colors hover:bg-dark-primary-30"
                      >
                        <Github
                          height="1rem"
                          width="1rem"
                          fill="white"
                          className="opacity-disable"
                        />
                      </div>
                    </DynamicLink>
                    <DynamicLink href="https://discord.gg/MDfNgatN">
                      <div
                        className="flex justify-center items-center relative rounded-full
              p-1 border border-transparent transition-colors hover:bg-dark-primary-30"
                      >
                        <Discord
                          height="1rem"
                          width="1rem"
                          fill="white"
                          className="opacity-disable"
                        />
                      </div>
                    </DynamicLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Connector />
    </nav>
  );
};

export default NavHolder;
