"use client";
import React, { useState, useEffect } from "react";
import { useConnect } from "wagmi";
import { config } from "@/providers/wallet/config";

import { useModal } from "@/hooks/contexts";
import { sortWallets } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";
import { Column } from "@/components/Box";
import { cn } from "@/lib/utils";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

const Wallets = (): JSX.Element => {
  const [recentConnector, setRecentConnector] = useState("");
  const { toggleOpen } = useModal();
  const { connect, connectors } = useConnect({
    mutation: {
      // Close the modal even if user denies request.
      onSettled: () => toggleOpen(),
    },
  });

  useEffect(() => {
    const getRecent = async (): Promise<void> => {
      const recentPromise = config.storage?.getItem("recentConnectorId") || "";
      if (recentPromise) {
        setRecentConnector((await Promise.resolve(recentPromise)) || "");
      }
    };
    getRecent();
  }, []);

  const walletsShow = sortWallets([...connectors], recentConnector, true);

  return (
    <Column className={cn("p-4", "w-[250px] min-w-fit h-[350px] min-h-fit text-center")}>
      <p className="font-bold">Connect Wallet</p>
      <hr className="border-gray-200/20 my-2" />
      {walletsShow.map((connector) => (
        <div
          key={connector.uid}
          onClick={(): void => connect({ connector })}
          className="flex flex-row justify-start items-center rounded-lg gap-2
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
        </div>
      ))}
    </Column>
  );
};

export default Wallets;
