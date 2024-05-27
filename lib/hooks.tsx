import { useEffect, useRef, useContext, useReducer } from "react";

import { UserStateI, ModalStateI, EventStateI } from "./types";
import UserContext from "@/providers/user/context";
import ModalContext from "@/providers/modal/context";
import EventContext from "@/providers/events/context";
import { useClient, useWriteContract } from "wagmi";
import { Abi, Address } from "viem";
import { localhost } from "viem/chains";
import { waitForTransactionReceipt } from "viem/actions";

export const useModal = (): ModalStateI => useContext(ModalContext);
export const useUser = (): UserStateI => useContext(UserContext);
export const useEvent = (): EventStateI => useContext(EventContext);

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
}: {
  abi: Abi;
  address: Address;
  functionName: string;
}): {
  writeContractWithEvents: (
    writeArgs: readonly unknown[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  state: Record<string, boolean>;
  dispatch: React.Dispatch<Record<string, boolean>>;
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

  const { setTxn, setStatus } = useEvent();
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE });
  const client = useClient();

  // rather than using react-query mutations, I explicitly throw "callbacks" in the
  // thenable statements, for cleaner error handling.
  const { writeContractAsync } = useWriteContract();

  const writeContractWithEvents = (writeArgs: readonly unknown[]): Promise<void> => {
    if (!client) return Promise.reject();
    dispatch({ ...INITIAL_STATE, isPendingSign: true });
    return writeContractAsync({
      abi,
      address,
      functionName,
      args: writeArgs,
      chainId: localhost.id,
    })
      .then((hash) => {
        setTxn(hash as string);
        setStatus("pending");
        dispatch({ isPendingSign: false, isSuccessSign: true, isPendingWrite: true });
        return waitForTransactionReceipt(client, { hash });
      })
      .then((receipt) => {
        console.log(receipt);
        if (receipt.status === "success") {
          setStatus("success");
          dispatch({ isPendingWrite: false, isSuccessWrite: true });
        } else {
          setStatus("error");
          dispatch({ isPendingWrite: false, isErrorWrite: true });
          throw new Error("Transaction Error");
        }
      })
      .catch((error) => {
        // Come back to this.
        if (error.message !== "Transaction Error") {
          dispatch({ isPendingSign: false, isErrorSign: true });
        }
        // Explicitly throw (again) to make it thenable, and catchable by external fct calls.
        throw new Error(error);
      });
  };

  return {
    writeContractWithEvents,
    dispatch,
    state,
  };
};
