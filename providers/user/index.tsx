"use client";

import { useEffect, useState } from "react";
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import { UserStateI } from "@/lib/types";
import UserContext from "./context";
import { createSiweMessage } from "@/lib/utils";
import { verify, logout as siweLogout, getUser } from "@/actions/siwe";

const UserProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // controls the lifecyle of connections + SIWE.

  const { address, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const [isPending, setIsPending] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isInitialConnection, setIsInitialConnection] = useState(false);

  const logout = (): void => {
    siweLogout().then(() => {
      disconnect();
      setIsAuthenticated(false);
    });
  };

  const requireSigning = (): void => {
    if (!address || !chainId) return;
    let messageParsed = "";
    console.log("being called");
    setIsPending(true);
    setIsRejected(false);
    createSiweMessage(address as string, chainId)
      .then((message) => {
        messageParsed = message;
        return signMessageAsync({ message });
      })
      .then((signature) => {
        return verify({ message: messageParsed, signature });
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.log(error);
        setIsAuthenticated(false);
        setIsRejected(true);
        logout();
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    // If a user is connected, then every time the address changes (excluding initial connection)
    // require signed verification, unless the current verification already exists for that
    // specific wallet. Forcefully log them out if they reject signing, as we can't authenticate them.
    if (isInitialConnection || isPending) {
      setIsPending(false);
      setIsRejected(false);
      setIsAuthenticated(false);
      setIsInitialConnection(false);
      return;
    }
    const handleChange = (): void => {
      // on account change, except initial connection, re-authenticate.
      getUser().then((user) => {
        if (user.success && user.address === address) {
          setIsAuthenticated(true);
          return;
        }
        if (user.success && !address) {
          // possible a user manually disconnected from the dApp.
          logout();
          return;
        }
        return requireSigning();
      });
    };

    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const login = ({ connector }: { connector: Connector }): void => {
    // on initial login, we only connect the account. Then we explicitly ask for signing
    // permission. On account changes, we automatically ask for signing permission.
    setIsPending(true);
    setIsInitialConnection(true);
    connectAsync({ connector })
      .catch(() => setIsRejected(true))
      .finally(() => setIsPending(false));
  };

  const userState: UserStateI = {
    login,
    logout,
    authenticate: requireSigning,
    isAuthenticated,
    isPending,
    isRejected,
  };

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

export default UserProvider;
