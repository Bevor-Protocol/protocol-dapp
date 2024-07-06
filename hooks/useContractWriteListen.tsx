import { Abi, Address } from "viem";
import { localhost } from "viem/chains";
import { useClient, useWriteContract } from "wagmi";
import { useEvent } from "./useContexts";
import { useReducer } from "react";
import { waitForTransactionReceipt } from "viem/actions";
import { contractWriteReducer } from "@/reducers";
import { CONTRACT_WRITE_INITIAL_STATE } from "@/utils/initialState";

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
  const { setTxn, setStatus } = useEvent();
  const [state, dispatch] = useReducer(contractWriteReducer, { ...CONTRACT_WRITE_INITIAL_STATE });
  const client = useClient();

  // rather than using react-query mutations, I explicitly throw "callbacks" in the
  // thenable statements, for cleaner error handling.
  const { writeContractAsync } = useWriteContract();

  const writeContractWithEvents = (writeArgs: readonly unknown[]): Promise<void> => {
    if (!client) return Promise.reject();
    dispatch({ ...CONTRACT_WRITE_INITIAL_STATE, isPendingSign: true });
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
