"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useConnectors } from "wagmi";

import { config } from "@/providers/wallet/config";
import { useModal, useUser } from "@/lib/hooks";
import { sortWallets } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";
import { Column, Row } from "@/components/Box";
import { Loader } from "@/components/Loader";
import Image from "next/image";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

const SignIn = (): JSX.Element => {
  const [recentConnector, setRecentConnector] = useState("");
  const { connector: activeConnector } = useAccount();
  const { toggleOpen } = useModal();
  const { login, isPendingSign, isAuthenticated, isRejected } = useUser();
  const connectors = useConnectors();

  useEffect(() => {
    const getRecent = async (): Promise<void> => {
      const recentPromise = config.storage?.getItem("recentConnectorId") || "";
      if (recentPromise) {
        setRecentConnector((await Promise.resolve(recentPromise)) || "");
      }
    };
    getRecent();
  }, []);

  useEffect(() => {
    if (isAuthenticated || isRejected) toggleOpen();
  }, [isAuthenticated, isRejected, toggleOpen]);

  const walletsShow = sortWallets([...connectors], recentConnector, true);

  if (isPendingSign && !!activeConnector) {
    return (
      <Column className="items-center justify-center">
        <div className="aspect-[1091/1685] relative h-20">
          <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
        </div>
        <p className="font-bold text-xl my-4">Sign</p>
        <div className="relative">
          {activeConnector.icon ? (
            <Icon
              image={activeConnector.icon}
              size="md"
              className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            />
          ) : (
            <div className="h-10 w-10">{IconMapper[activeConnector.id]}</div>
          )}
          <Loader className="h-14 w-14" />
        </div>
        <p className="text-sm my-4 text-center">
          This is purely an off-chain interaction. It does not give us permissions, but it confirms
          that you own this account
        </p>
      </Column>
    );
  }

  return (
    <Column className="items-center justify-center">
      <div className="aspect-[1091/1685] relative h-20">
        <Image src="/logo.png" alt="brand logo" fill={true} sizes="any" />
      </div>
      <p className="font-bold text-xl mt-4">Connect to Bevor</p>
      <hr className="border-gray-200/20 my-2 w-1/2" />
      <Column className="">
        {walletsShow.map((connector) => (
          <Row
            key={connector.uid}
            onClick={(): void => login({ connector })}
            className="justify-start items-center rounded-lg gap-2 relative
px-2 py-1 border border-transparent transition-colors hover:bg-dark-primary-30 cursor-pointer"
          >
            {connector.icon ? (
              <Icon image={connector.icon} size="xs" />
            ) : (
              <div className="h-5 w-5">{IconMapper[connector.id]}</div>
            )}
            <span className="whitespace-nowrap text-sm">{connector.name}</span>
            {recentConnector == connector.id && (
              <div className="flex bg-blue-600/50 rounded-xl px-2 py-1 h-fit">
                <span className="text-blue-600 text-xxs">recent</span>
              </div>
            )}
          </Row>
        ))}
      </Column>
    </Column>
  );
};

export default SignIn;
