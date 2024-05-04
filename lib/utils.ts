import { Children, ReactNode, isValidElement, ReactElement } from "react";
import { Address } from "viem";
import { Connector } from "wagmi";
import { SiweMessage } from "siwe";

import { nonce } from "@/actions/siwe";

export const cn = (...args: unknown[]): string => {
  return args
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim();
};

export const trimAddress = (address: Address | string | undefined): string => {
  return address?.substring(0, 6) + "..." + address?.substring(address.length - 3, address.length);
};

export const sortWallets = (
  array: Connector[],
  recent: string,
  excludeInjected = true,
): Connector[] => {
  const arraySorted = array.toSorted((a, b) => a.name.localeCompare(b.name));
  if (excludeInjected) {
    const injectedIndex = arraySorted.findIndex((item) => item.id === "injected");
    arraySorted.splice(injectedIndex, 1);
  }
  const recentIndex = arraySorted.findIndex((item) => item.id === recent);

  if (recentIndex !== -1) {
    const recentItem = arraySorted.splice(recentIndex, 1);
    arraySorted.unshift(...recentItem);
  }

  return arraySorted;
};

export const filterChildren = (children: ReactNode, name: string): ReactElement => {
  return Children.toArray(children).find((child) => {
    if (isValidElement(child) && typeof child.type !== "string" && "displayName" in child.type) {
      return child.type.displayName == name;
    }
    return false;
  }) as ReactElement;
};

export const timeSince = (time: Date): string => {
  const seconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);

  let interval = seconds / 31_536_000;

  if (interval > 1) {
    return Math.floor(interval) + " yrs ago";
  }
  interval = seconds / 2_592_000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hrs ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " mins ago";
  }
  return Math.floor(seconds) + " secs ago";
};

export const createSiweMessage = async (address: string, chainId: number): Promise<string> => {
  const nonceRes = await nonce();
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in with Ethereum.",
    uri: window.location.origin,
    version: "1",
    chainId,
    nonce: nonceRes,
    // expirationTime
  });
  return message.prepareMessage();
};
