import { Abi, Address } from "viem";
import { localhost } from "viem/chains";
import { useClient, useWriteContract } from "wagmi";
import { useToast } from "./useContexts";
import { useReducer, useState } from "react";
import { waitForTransactionReceipt } from "viem/actions";
import { contractWriteReducer } from "@/reducers";
import { CONTRACT_WRITE_INITIAL_STATE } from "@/utils/initialState";
import { TransactionEnum } from "@/utils/types/enum";
import Transaction from "@/components/Toast/Content/transaction";

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
  const [txn, setTxn] = useState("123");
  const { toggleOpen, setContent } = useToast();
  const [state, dispatch] = useReducer(contractWriteReducer, { ...CONTRACT_WRITE_INITIAL_STATE });
  // rather than using react-query mutations, I explicitly throw "callbacks" in the
  // thenable statements, for cleaner error handling.
  const { writeContractAsync } = useWriteContract();
  const client = useClient();

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
        dispatch({ isPendingSign: false, isSuccessSign: true, isPendingWrite: true });
        setContent(<Transaction txn={hash as string} status={TransactionEnum.PENDING} />);
        toggleOpen();
        return waitForTransactionReceipt(client, { hash });
      })
      .then((receipt) => {
        if (receipt.status === "success") {
          setContent(<Transaction txn={txn} status={TransactionEnum.SUCCESS} />);
          toggleOpen();
          dispatch({ isPendingWrite: false, isSuccessWrite: true });
        } else {
          setContent(<Transaction txn={txn} status={TransactionEnum.ERROR} />);
          toggleOpen();
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
        throw error;
      });
  };

  return {
    writeContractWithEvents,
    dispatch,
    state,
  };
};
