"use client";
import React, { useState, useEffect } from "react";
import { useConnect, useDisconnect, useSignMessage } from "wagmi";

import { config } from "@/providers/wallet/config";
import { useModal } from "@/lib/hooks";
import { sortWallets } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { CoinbaseWallet, WalletConnect } from "@/assets/wallets";
import { Column } from "@/components/Box";
import { verify, getUser } from "@/actions/siwe";
import { createSiweMessage } from "@/lib/utils";
import { Loader } from "@/components/Loader";

const IconMapper: Record<string, React.ReactNode> = {
  walletConnect: <WalletConnect height="20" width="20" />,
  coinbaseWalletSDK: <CoinbaseWallet height="20" width="20" />,
};

const Wallets = (): JSX.Element => {
  const [recentConnector, setRecentConnector] = useState("");
  const [pending, setPending] = useState(false);
  const { toggleOpen } = useModal();
  const { disconnect } = useDisconnect();

  const { signMessageAsync } = useSignMessage({
    mutation: {
      onSuccess: async (data, variables) => {
        await verify({
          message: variables.message.toString(),
          signature: data!,
        })
          .then((verified) => {
            if (!verified) {
              throw new Error("not verified");
            }
            return getUser();
          })
          .then((user) => {
            console.log(user);
          })
          .catch((error) => {
            console.log(error);
            disconnect();
          })
          .finally(() => {
            toggleOpen();
          });
      },
      onError: (error) => {
        console.log("should close");
        console.log(error);
        disconnect();
        // don't need to toggleClose() here, bubbles down to connect() onError.
      },
    },
  });

  const { connect, connectors } = useConnect({
    mutation: {
      // Close the modal even if user denies request.
      onSuccess: async (data) => {
        const address = data.accounts[0];
        const chainId = data.chainId;

        const message = await createSiweMessage(address, chainId);
        setPending(true);
        await signMessageAsync({ message });
      },
      onError: () => {
        console.log("might close");
        toggleOpen();
      },
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
    <Column className="p-4 w-[250px] min-w-fit h-[350px] min-h-fit text-center">
      {!pending ? (
        <>
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
        </>
      ) : (
        <>
          <p>Pending Signing Request</p>
          <Loader className="h-10 w-10" />
        </>
      )}
    </Column>
  );
};

export default Wallets;
