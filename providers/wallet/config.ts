import { http, cookieStorage, createStorage, createConfig } from "wagmi";
// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { injected } from "wagmi/connectors";

import { goerli, polygonMumbai, localhost, Chain } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

if (!projectId) throw new Error("Project ID is not defined");

// const metadata = {
//   name: "Bevor",
//   description: "Bevor dApp",
//   url: "https://app.bevor.io",
//   icons: ["https://www.bevor.io/apple-icon.png"],
// };

// Rather than using the web3modal defaultWagmiConfig(), I elect to use the custom
// wagmi createConfig(). We lose some metadata, description and url become unused,
// so maybe come back to this. I think the web3modal config was the cause of some
// server vs. client side errors.

let chains: readonly [Chain, ...Chain[]];
let transports;

if (process.env.NODE_ENV === "development") {
  chains = [goerli, polygonMumbai, localhost];
  transports = {
    [goerli.id]: http(),
    [polygonMumbai.id]: http(),
    [localhost.id]: http(),
  };
} else {
  chains = [goerli, polygonMumbai];
  transports = {
    [goerli.id]: http(),
    [polygonMumbai.id]: http(),
  };
}

const config = createConfig({
  chains,
  transports,
  connectors: [
    // walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    // coinbaseWallet({
    //   appName: metadata.name,
    //   appLogoUrl: metadata.icons[0],
    //   headlessMode: true,
    // }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export { config, projectId };
