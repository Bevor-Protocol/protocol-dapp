"use client";

import { type State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";

const makeQueryClient = (): QueryClient => {
  return new QueryClient();
};

let clientQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = (): QueryClient => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientQueryClient) clientQueryClient = makeQueryClient();
    return clientQueryClient;
  }
};

const WalletProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: State;
}): JSX.Element => {
  const queryClient = getQueryClient();
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
