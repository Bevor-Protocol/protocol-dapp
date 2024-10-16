import { cookieStorage, createConfig, createStorage, http } from "wagmi";
// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { injected, mock } from "wagmi/connectors";

import { createClient } from "viem";
import { base, localhost, type Chain } from "wagmi/chains";

// const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

// if (!projectId) throw new Error("Project ID is not defined");

let chains: readonly [Chain, ...Chain[]];
let connectors = [];

if (process.env.NODE_ENV === "development") {
  chains = [localhost, base];
  connectors = [
    injected({ shimDisconnect: true }),
    mock({
      accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
      features: {
        signMessageError: false,
        signTypedDataError: false,
      },
    }),
  ];
} else {
  chains = [base];
  connectors = [injected({ shimDisconnect: true })];
}

const config = createConfig({
  chains,
  // transports,
  client: ({ chain }) => createClient({ chain, transport: http() }),
  connectors,
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

// export { config, projectId };
export { config };
