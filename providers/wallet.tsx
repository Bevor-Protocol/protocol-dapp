"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { localhost, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  // getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  // rainbowWallet,
  // walletConnectWallet,
  // coinbaseWallet,
  // metaMaskWallet,
  // ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { chains, publicClient } = configureChains([localhost, goerli], [publicProvider()]);

  // const appName = "Bevor Protocol";
  // const projectId = "protocol-dapp";

  // const { connectors } = getDefaultWallets({
  //   appName: "Bevor Protocol",
  //   projectId: "protocol-dapp",
  //   chains,
  // });

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        injectedWallet({ chains }),
        // metaMaskWallet({ chains, projectId }),
        // walletConnectWallet({ projectId, chains }),
      ],
    },
    {
      groupName: "Other",
      wallets: [
        // rainbowWallet({ projectId, chains }),
        // coinbaseWallet({ appName, chains }),
        // ledgerWallet({ chains, projectId }),
      ],
    },
  ]);

  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
