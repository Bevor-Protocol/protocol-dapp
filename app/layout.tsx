import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import WalletProvider from "@/providers/wallet";
import { headers } from "next/headers";

import Footer from "@/components/layout/Footer";
import Layout from "@/components/layout/Layout";
import Nav from "@/components/layout/Nav";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "700", "800"] });

export const metadata: Metadata = {
  title: "Bevor Protocol",
  description: "Bevor Protocol + DAO | dApp",
  keywords: ["web3", "NextJS", "DAO", "ReactJS", "dApp"],
  openGraph: {
    title: "Bevor Protocol",
    description: "Bevor Protocol + DAO | dApp",
    url: "https://www.bevor.io",
    siteName: "Bevor.io",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@BevorProtocol",
    creator: "@BevorProtocol",
    title: "Bevor Protocol",
    description: "Bevor Protocol + DAO | dApp",
  },
  authors: [{ name: "Bevor Protocol" }],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <WalletProvider>
          <Layout>
            <Nav curPath={pathname} />
            {children}
            <Footer />
          </Layout>
        </WalletProvider>
      </body>
    </html>
  );
};
