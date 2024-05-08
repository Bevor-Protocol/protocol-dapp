"use client";

import { useEffect, useState } from "react";
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import { UserStateI } from "@/lib/types";
import UserContext from "./context";
import { createSiweMessage } from "@/lib/utils";
import { verify, logout as siweLogout, getUser } from "@/actions/siwe";
import { Address } from "viem";

const UserProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  /* 
  Controls the lifecyle of connections + SIWE.
  FLOW is:
    - Upon initial connection, require signing to authenticate
      - If user rejects request, forcefully disconnect (the session won't be set)
      - If user acceptes request, allow connection and authenticate
      - If authentication fails, forcefully disconnect
    - If user is authenticated, and tries to change accounts, prompt them to logout (reset SIWE)
    or to switch back to authenticated account (pulled from SIWE)
  */
  const { connectAsync, isPending: isPendingConnect } = useConnect();
  const { signMessageAsync, isPending: isPendingSign } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { address, chainId } = useAccount();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isRequestingAccountChange, setIsRequestingAccountChange] = useState(false);

  const logout = (): void => {
    siweLogout().then(() => {
      disconnect();
      setIsAuthenticated(false);
    });
  };

  const requireSigning = (
    addressUse: Address | undefined,
    chainIdUse: number | undefined,
  ): void => {
    if (!addressUse || !chainIdUse) return;
    let messageParsed = "";
    setIsRejected(false);
    createSiweMessage(addressUse, chainIdUse)
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
      });
  };

  useEffect(() => {
    const handleChange = (): void => {
      getUser().then((user) => {
        if (!user.success && !user.address) {
          if (address && !isPendingSign && !isPendingConnect) {
            return requireSigning(address, chainId);
          }
        }
      });
    };

    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const login = ({ connector }: { connector: Connector }): void => {
    // on initial login, we only connect the account. Then we explicitly ask for signing
    // permission. On account changes, we automatically ask for signing permission.
    connectAsync({ connector })
      .then((data) => {
        return requireSigning(data.accounts[0], data.chainId);
      })
      .catch(() => {
        console.log("rejectected connection");
        setIsRejected(true);
      });
  };

  const userState: UserStateI = {
    login,
    logout,
    isAuthenticated,
    isPendingSign,
    isPendingConnect,
    isRequestingAccountChange,
    isRejected,
    setIsAuthenticated,
    setIsRequestingAccountChange,
  };

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

export default UserProvider;
