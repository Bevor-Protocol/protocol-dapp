// import "./globals.css";
import { Metadata } from "next";
import WalletProvider from "@/providers/wallet";
import StyledComponentRegistry from "@/providers/ssr_styled";
import ThemeProvider from "@/providers/theme";

import Footer from "@/components/Footer";
import { Layout } from "@/components/Common";
import Nav from "@/components/Nav";
import { jakarta } from "@/theme/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://bevor.io"),
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
    url: "https://www.bevor.io",
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

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <WalletProvider>
          <StyledComponentRegistry>
            <ThemeProvider>
              <Layout>
                <Nav />
                <main>{children}</main>
                <Footer />
              </Layout>
            </ThemeProvider>
          </StyledComponentRegistry>
        </WalletProvider>
      </body>
    </html>
  );
};
