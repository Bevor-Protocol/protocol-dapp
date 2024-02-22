"use client";

import { type State, WagmiProvider } from "wagmi";

import { config, projectId } from "./config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
});

const WalletProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}): JSX.Element => {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
