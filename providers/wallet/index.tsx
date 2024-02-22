"use client";

import { type State, WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, projectId } from "./config";

import { web3modalTheme } from "@/theme/web3modal";

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  themeVariables: web3modalTheme,
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
