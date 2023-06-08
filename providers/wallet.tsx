"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { chains, publicClient } = configureChains(
    [mainnet],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string })],
  );

  const { connectors } = getDefaultWallets({
    appName: "Bevor Protocol",
    projectId: "protocol-dapp",
    chains,
  });

  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
