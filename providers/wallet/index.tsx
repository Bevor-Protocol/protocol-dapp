"use client";

import { type State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";

// import { web3modalTheme } from "@/theme/web3modal";

const queryClient = new QueryClient();

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
