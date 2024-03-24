import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Plus_Jakarta_Sans } from "next/font/google";

import WalletProvider from "@/providers/wallet";
import ModalProvider from "@/providers/modal";
import { config } from "@/providers/wallet/config";

import { Layout, Footer, Nav } from "@/components/Layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.bevor.io"),
  title: "Bevor Protocol",
  description: "Bevor Protocol + DAO | dApp",
  keywords: ["web3", "NextJS", "DAO", "ReactJS", "dApp"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/apple-icon.png",
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
  openGraph: {
    title: "Bevor Protocol",
    description: "Bevor Protocol + DAO | dApp",
    url: "https://app.bevor.io",
    images: [
      {
        width: 1200,
        height: 630,
        url: "/opengraph.png",
      },
    ],
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
    images: [
      {
        width: 1200,
        height: 630,
        url: "/opengraph.png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "700", "800"] });

const Page = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <WalletProvider initialState={initialState}>
          <ModalProvider>
            <Layout>
              <Nav />
              <main>{children}</main>
              <Footer />
            </Layout>
          </ModalProvider>
        </WalletProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default Page;
