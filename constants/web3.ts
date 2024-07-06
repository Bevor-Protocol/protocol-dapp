import { Address } from "viem";

export const ChainPresets: Record<number, string> = {
  // #TODO update for bases
  // Ethereum
  5: "/images/eth.png",
  // Polygon
  80001: "/images/polygon.png",
  // Default
  99999: "/images/unknown.svg",
};

export const AvailableTokens: Record<
  string,
  { symbol: string; decimals: number; address: Address }[]
> = {
  localhost: [
    {
      symbol: "BVR",
      decimals: 18,
      address: "0x7fee5c8dc3bb4740f9d945941fddb4288e25fe50",
    },
  ],
};
