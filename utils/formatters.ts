import { Address } from "viem";

export const trimAddress = (address: Address | string | undefined): string => {
  return address?.substring(0, 6) + "..." + address?.substring(address.length - 3, address.length);
};

export const trimTxn = (txn: string | undefined): string => {
  return txn?.substring(0, 6) + "..." + txn?.substring(txn.length - 6, txn.length);
};
