"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { localhost } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { chains, publicClient } = configureChains([localhost], [publicProvider()]);

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
