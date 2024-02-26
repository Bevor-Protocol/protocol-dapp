import { Address } from "viem";
import { Connector } from "wagmi";

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
