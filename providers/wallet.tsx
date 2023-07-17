"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { jakarta } from "@/theme/fonts";

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
        themeVariables={{
          "--w3m-font-family": jakarta.style.fontFamily,
          "--w3m-font-feature-settings": "normal",
          "--w3m-background-color": "rgb(20,20,20)",
        }}
        // termsOfServiceUrl="https://bevor.io"
        // chainImages={{
        //   5: "https://chainlist.org/unknown-logo.png",
        //   80001: "https://assets-global.website-files.com/637359c81e22b715cec245ad/63f775c90fb78119d7a9808e_polygon-webclip.png",
        // }}
      />
    </>
  );
};
