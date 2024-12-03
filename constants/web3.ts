import { Address } from "viem";

export const ChainPresets: Record<number, string> = {
  // #TODO update for bases
  // Ethereum
  5: "/images/eth.png",
  // Base
  8453: "/images/base.png",
  // Localhost
  1337: "/images/unknown.svg",
  // Default
  99999: "/images/unknown.svg",
};

export const AvailableTokens: Record<
  string,
  { symbol: string; decimals: number; address: Address }[]
> = {
  Localhost: [
    {
      symbol: "BVR",
      decimals: 18,
      address: "0x7fee5c8dc3bb4740f9d945941fddb4288e25fe50",
    },
  ],
  Base: [
    {
      symbol: "BVR",
      decimals: 18,
      address: "0x7fee5c8dc3bb4740f9d945941fddb4288e25fe50",
    },
  ],
};

export const Contracts = {
  Localhost: {
    bevorProtocol: {
      name: "BevorProtocol",
      address: "0x3b598b557c4bdb447e9727665350626a00c73531" as Address,
    },
    audit: {
      name: "Audit",
      address: "0xd7a6163408125cc3adc2944a17d1bb3e9abc9d4e" as Address,
    },
    bvrToken: {
      name: "ERC20Token",
      address: "0x7fee5c8dc3bb4740f9d945941fddb4288e25fe50" as Address,
    },
  },
  Base: {},
};
