import { Children, ReactNode, isValidElement, ReactElement } from "react";
import { Address } from "viem";
import { Connector } from "wagmi";
import { SiweMessage } from "siwe";

import { nonce } from "@/actions/siwe";
import { AuditTruncatedI, HistoryI } from "./types";

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

export const trimTxn = (txn: string | undefined): string => {
  return txn?.substring(0, 6) + "..." + txn?.substring(txn.length - 6, txn.length);
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

export const checkLocalMostRecent = (
  history: HistoryI[],
  auditId: string,
  user: string | undefined,
): boolean => {
  /* 
    localstorage of structure:
    { address: { auditid: id }}
  */

  if (typeof window == undefined) return false;
  if (history.length == 0) return false;
  // We already don't display for non-members of an audit, but include this for type safety.
  if (!user) return false;
  const localHistory = localStorage.getItem("history_noti");
  const mostRecent = history[history.length - 1].id;
  if (localHistory) {
    const parsed = JSON.parse(localHistory);
    if (user in parsed) {
      if (auditId in parsed[user]) {
        if (parsed[user][auditId] == mostRecent) {
          return false;
        }
      }
    }
  }
  return true;
};

export const checkLocalMostRecentMany = (
  address: string,
  audits: AuditTruncatedI[],
): Record<string, boolean> | undefined => {
  if (typeof window == undefined) return;
  const localHistory = localStorage.getItem("history_noti") || "null";
  const parsed = JSON.parse(localHistory);
  const shouldSkip = !parsed || !(address in parsed); // no object exists for this user.
  const out: Record<string, boolean> = {};
  audits.forEach((audit) => {
    const isHistory = audit.history.length > 0;
    if (!isHistory) {
      out[audit.id] = false;
    } else {
      if (shouldSkip) {
        out[audit.id] = true;
      } else {
        if (audit.id in parsed[address]) {
          out[audit.id] = parsed[address][audit.id] != audit.history[0].id;
        } else {
          out[audit.id] = true;
        }
      }
    }
  });
  return out;
};

export const setLocalMostRecent = (
  history: HistoryI[],
  auditId: string,
  user: string | undefined,
): void => {
  if (typeof window == undefined) return;
  if (history.length == 0) return;
  if (!user) return;
  const localHistory = localStorage.getItem("history_noti");
  const mostRecent = history[history.length - 1].id;
  if (!localHistory) {
    const toCreate = { [user]: { [auditId]: mostRecent } };
    localStorage.setItem("history_noti", JSON.stringify(toCreate));
  } else {
    const parsed = JSON.parse(localHistory);
    if (!(user in parsed)) {
      parsed[user] = {};
    }
    parsed[user][auditId] = mostRecent;
    localStorage.setItem("history_noti", JSON.stringify(parsed));
  }
};
