import "@/styles/globals.css";
import { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

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
  return (
    <html lang="en">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
};
