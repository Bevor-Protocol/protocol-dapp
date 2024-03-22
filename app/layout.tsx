import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { cookieToInitialState } from "wagmi";

import WalletProvider from "@/providers/wallet";
import ModalProvider from "@/providers/modal";
import { config } from "@/providers/wallet/config";
import StyledComponentRegistry from "@/providers/styleSheet";
import ThemeProvider from "@/providers/theme";

import Footer from "@/components/Footer";
import { Layout } from "@/components/Common";
import Nav from "@/components/Nav";
import { jakarta } from "@/theme/fonts";

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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

const Page = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // docs say to use headers().get('cookie'), but I get issues with doing this.
  // specifically, it says can't run connections.get, I think because the
  // cookieToInitialState outputs an array of Map, which doesn't work... I might
  // need to come back to this.
  const initialState = cookieToInitialState(config, cookies().get("wagmi.store")?.value);
  // const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <WalletProvider initialState={initialState}>
          <StyledComponentRegistry>
            <ThemeProvider>
              <ModalProvider>
                <Layout>
                  <Nav />
                  <main>{children}</main>
                  <Footer />
                </Layout>
              </ModalProvider>
            </ThemeProvider>
          </StyledComponentRegistry>
        </WalletProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default Page;
