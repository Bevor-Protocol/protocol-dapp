import { useEffect, useRef, useState, useContext, useReducer } from "react";

import { UserStateI, ModalStateI } from "./types";
import UserContext from "@/providers/user/context";
import ModalContext from "@/providers/modal/context";
import { useWatchContractEvent, useWriteContract } from "wagmi";
import { Abi, Address } from "viem";
import { localhost } from "viem/chains";

export const useModal = (): ModalStateI => useContext(ModalContext);
export const useUser = (): UserStateI => useContext(UserContext);

export const useClickOutside = (
  node: React.RefObject<HTMLElement | undefined>,
  handler: undefined | (() => void),
): void => {
  const handlerRef = useRef<undefined | (() => void)>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (node.current && !node.current.contains(e.target as Node)) {
        if (handlerRef.current) handlerRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [node]);
};

export const useContractWriteListen = ({
  abi,
  address,
  functionName,
  eventName,
}: {
  abi: Abi;
  address: Address;
  functionName: string;
  eventName: string;
}): {
  writeContractWithEvents: (
    writeArgs: readonly unknown[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  state: Record<string, boolean>;
  txn: string;
} => {
  const reducer = (
    state: Record<string, boolean>,
    action: Record<string, boolean>,
  ): { [key: string]: boolean } => {
    Object.entries(action).forEach(([key, value]) => {
      if (key in state) {
        state[key] = value;
      }
    });
    return state;
  };

  const INITIAL_STATE = {
    isPendingSign: false,
    isPendingWrite: false,
    isSuccessSign: false,
    isSuccessWrite: false,
    isErrorSign: false,
    isErrorWrite: false,
  };

  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE });
  const [txn, setTxn] = useState("");

  useWatchContractEvent({
    abi,
    address,
    eventName,
    onLogs: (logs) => {
      if (logs[0].transactionHash === txn) {
        // Not sure if this is a local network issue, but it was firing immediately.
        console.log("WATCH SUCCESS", logs[0].transactionHash);
        dispatch({ isPendingWrite: false, isSuccessWrite: true });
      }
    },
    onError: (error) => {
      console.log("WATCH ERROR", error);
      dispatch({ isPendingWrite: false, isErrorWrite: true });
    },
  });

  // rather than using react-query mutations, I explicitly throw "callbacks" in the
  // thenable statements, for cleaner error handling.
  const { writeContractAsync } = useWriteContract();

  const writeContractWithEvents = (writeArgs: readonly unknown[]): Promise<void> => {
    dispatch({ ...INITIAL_STATE, isPendingSign: true });
    return writeContractAsync({
      abi,
      address,
      functionName,
      args: writeArgs,
      chainId: localhost.id,
    })
      .then((data) => {
        setTxn(data);
        dispatch({ isPendingSign: false, isSuccessSign: true, isPendingWrite: true });
      })
      .catch((error) => {
        dispatch({ isPendingSign: false, isErrorSign: true });
        // Explicitly throw to make it thenable, and catchable by external fct calls.
        throw new Error(error);
      });
  };

  return {
    writeContractWithEvents,
    state,
    txn,
  };
};
