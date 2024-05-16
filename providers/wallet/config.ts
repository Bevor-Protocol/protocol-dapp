import { http, cookieStorage, createStorage, createConfig } from "wagmi";
// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { injected } from "wagmi/connectors";

import { goerli, polygonMumbai, localhost, Chain } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

if (!projectId) throw new Error("Project ID is not defined");

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
