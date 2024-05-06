"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import type { Connector } from "wagmi";

import { UserStateI } from "@/lib/types";
import UserContext from "./context";
import { createSiweMessage } from "@/lib/utils";
import { verify, logout as siweLogout, getUser } from "@/actions/siwe";

const UserProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { address, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const [isPending, setIsPending] = useState(false);
  const [listenForChange, setListenForChange] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = (): void => {
    siweLogout().then(() => disconnect());
  };

  const requireSigning = (addressSign: string, chainIdSign: number): Promise<void> => {
    setIsPending(true);
    return createSiweMessage(addressSign, chainIdSign)
      .then((message) => {
        return signMessageAsync({ message }).then((signature) => verify({ message, signature }));
      })
      .then((verified) => {
        setIsPending(false);
        if (!verified) {
          throw new Error("not verified");
        }
        setIsAuthenticated(true);
      });
  };

  useEffect(() => {
    // If a user if connected, then every time the address changes (including initial connection)
    // require signed verification, unless the current verification already exists for that
    // specific wallet.
    if (!chainId || !address || !listenForChange) return;
    const handleChange = (): void => {
      getUser()
        .then((user) => {
          if (user.success && user.address === address) {
            setIsAuthenticated(true);
            return;
          }
          return requireSigning(address as string, chainId);
        })
        .catch((error) => {
          // error with signing, or user rejected the request. Wipe cookie + disconnect
          console.log(error);
          logout();
          setIsAuthenticated(false);
        });
    };

    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const login = ({ connector, callback }: { connector: Connector; callback: () => void }): void => {
    setListenForChange(false);
    setIsPending(true);
    connectAsync({ connector })
      .then((account) => {
        return requireSigning(account.accounts[0], account.chainId);
      })
      .catch((error) => {
        console.log(error);
        logout();
      })
      .finally(() => {
        setListenForChange(true);
        callback();
      });
  };

  const userState: UserStateI = {
    isAuthenticated,
    login,
    logout,
    isPending,
  };

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

export default UserProvider;
