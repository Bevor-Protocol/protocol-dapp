import { ChainPresets } from "@/constants/web3";
import { SiweMessage } from "siwe";
import { Chain } from "viem";

export const createSiweMessage = async (
  address: string,
  chainId: number,
  nonce: string,
): Promise<string> => {
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in with Ethereum.",
    uri: window.location.origin,
    version: "1",
    chainId,
    nonce,
    // expirationTime
  });
  return message.prepareMessage();
};

export const getNetworkImage = (
  chain: Chain | undefined,
): { supported: boolean; networkImg: string } => {
  const result = { supported: false, networkImg: ChainPresets[99999] };
  if (chain && chain.id in ChainPresets) {
    result.supported = true;
    result.networkImg = ChainPresets[chain.id];
  }
  return result;
};

export const isFileEmpty = (file: File | undefined): boolean => {
  return !file || file.size <= 0 || !file.name;
};

export const generateTag = (...args: string[]): string => {
  return args.join(":");
};
