"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { w3Variables } from "@/theme/web3modal";

const chains = [goerli, polygonMumbai];
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId,
    chains,
  }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={w3Variables}
        // termsOfServiceUrl="https://bevor.io"
        // chainImages={{
        //   5: "/images/eth.png",
        //   80001: "/images/polygon.png",
        // }}
      />
    </>
  );
};
