import { http, cookieStorage, createStorage, createConfig } from "wagmi";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { goerli, polygonMumbai } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Bevor",
  description: "Bevor dApp",
  url: "https://app.bevor.io",
  icons: ["https://www.bevor.io/apple-icon.png"],
};

const config = createConfig({
  chains: [goerli, polygonMumbai],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [goerli.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
});

export { config, projectId };
