/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useConnect } from "wagmi";
import { config } from "@/providers/wallet/config";

import { useModal } from "@/hooks/contexts";
import { NavItem } from "@/components/Nav/styled";
import { Tag } from "@/components/Common";
import { Span } from "@/components/Text";
import { sortWallets } from "@/lib/utils";
import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";

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
    <div>
      {walletsShow.map((connector) => (
        <NavItem
          key={connector.uid}
          onClick={(): void => connect({ connector })}
          $height="fit-content"
          $align="center"
          $justify="flex-start"
          $gap="md"
          $active={true}
          $padding="5px 10px"
          style={{ cursor: "pointer" }}
        >
          <div style={{ height: "20px", width: "20px" }}>
            {connector.icon ? (
              <img
                src={connector.icon}
                alt="wallet logo"
                style={{ height: "100%", width: "100%" }}
              />
            ) : (
              IconMapper[connector.id]
            )}
          </div>
          <Span style={{ whiteSpace: "nowrap" }}>{connector.name}</Span>
          {recentConnector == connector.id && <Tag>recent</Tag>}
        </NavItem>
      ))}
    </div>
  );
};

export default Wallets;
