"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";
import { Column } from "@/components/Box";
import { useContractWriteListen } from "@/lib/hooks";

import BevorABI from "@/contracts/abis/BevorProtocol";
import { Abi, Address } from "viem";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/Loader";

type InitialStateI = {
  startTime: number;
  duration: number;
  cliff: number;
  tokenSymbol: string | undefined;
  vestingScheduleId: bigint | null;
  releasable: string | null;
  withdrawn: string | null;
};

const VestingDisplay = ({
  initialState,
  isAuditor,
}: {
  initialState: InitialStateI;
  isAuditor: boolean;
}): JSX.Element => {
  const { cliff, startTime, duration, vestingScheduleId, releasable, withdrawn, tokenSymbol } =
    initialState;
  const [percent, setPercent] = useState(0);
  const router = useRouter();

  const { state, dispatch, writeContractWithEvents } = useContractWriteListen({
    abi: BevorABI.abi as Abi,
    address: BevorABI.address as Address,
    functionName: "withdraw",
  });

  useEffect(() => {
    const computePercent = (): void => {
      const now = Math.round(new Date().getTime() / 1000);
      const percentage = Math.max(0, now - startTime) / duration;
      setPercent(100 * Math.min(percentage, 1));
      // ideally we would optimistically update the claimable value as well.
      // just requires additional logic and it might be off.
    };

    // emulate a realtime vesting process. durations can be quite small.
    const interval = setInterval(() => computePercent(), 5000);
    computePercent();

    return () => clearInterval(interval);
  }, [duration, startTime]);

  const withdraw = (): void => {
    writeContractWithEvents([vestingScheduleId]).then(() => {
      dispatch({
        isPendingSign: false,
        isPendingWrite: false,
        isSuccessSign: false,
        isSuccessWrite: false,
        isErrorSign: false,
        isErrorWrite: false,
      });
      // router.refresh() is only intended for server rendering.
      // need to explicitly reset the client state if I need to using dispatch()
      return router.refresh();
    });
  };

  return (
    <Column className="text-sm font-medium items-center mt-4">
      <div className="w-1/2 text-center">
        <h3>Vesting Progress</h3>
        <p className="text-xs mt-1 text-right w-full">{Math.round(percent * 100) / 100}%</p>
        <div className="relative w-full">
          <div className="relative h-2 overflow-x-hidden rounded-full bg-primary-light-20 w-full">
            <div
              className="h-full left-0 bg-white transition-all absolute"
              style={{ width: `${percent || 0}%` }}
            />
          </div>
          <div
            className="absolute w-[2px] h-4 bg-red-400 top-1/2 -translate-y-1/2"
            style={{ left: `${(100 * cliff) / duration}%` }}
          />
        </div>
        {isAuditor && releasable != null && withdrawn != null && (
          <Column className="mt-4 m-auto items-center gap-1">
            <p>
              <span className="mx-2">
                Claimable: {Number(releasable).toLocaleString()} {tokenSymbol}
              </span>
              <span className="mx-2">
                Withdrawn: {Number(withdrawn).toLocaleString()} {tokenSymbol}
              </span>
            </p>
            <Button
              onClick={withdraw}
              disabled={state.isPendingSign || state.isSuccessSign || releasable === "0"}
              className="relative"
            >
              <span className={cn((state.isPendingSign || state.isSuccessSign) && "invisible")}>
                Withdraw
              </span>
              {state.isPendingSign && <Loader className="h-4 w-4 absolute" />}
              {state.isSuccessSign && <span className="absolute">Success</span>}
            </Button>
          </Column>
        )}
      </div>
    </Column>
  );
};

export default VestingDisplay;
