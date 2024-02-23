import { Address } from "viem";

export const trimAddress = (address: Address | undefined): string => {
  return address?.substring(0, 6) + "..." + address?.substring(address.length - 3, address.length);
};
