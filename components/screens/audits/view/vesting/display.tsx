"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { Column } from "@/components/Box";

type InitialStateI = {
  startTime: number;
  duration: number;
  cliff: number;
  vestingScheduleId: bigint | null;
  releasable: bigint | null;
  withdrawn: bigint | null;
};

const VestingDisplay = ({
  initialState,
  isAuditor,
}: {
  initialState: InitialStateI;
  isAuditor: boolean;
}): JSX.Element => {
  const { cliff, startTime, duration, vestingScheduleId, releasable, withdrawn } = initialState;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // emulate a realtime vesting process. durations can be quite small.
    const interval = setInterval(() => {
      const now = Math.round(new Date().getTime() / 1000);
      const percentage = (now - startTime) / duration;
      setPercent(100 * Math.min(percentage, 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [duration, startTime]);

  const withdraw = (): void => {
    // this is where i need to add functionality.
    alert(`Call withdraw method from SC\n vestingscheduleid: ${vestingScheduleId}`);
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
              <span className="mx-2">Claimable: ${Number(releasable).toLocaleString()}</span>
              <span className="mx-2">Withdrawn: ${Number(withdrawn).toLocaleString()}</span>
            </p>
            <Button type="reset" onClick={withdraw} disabled={releasable == 0n}>
              Withdraw
            </Button>
          </Column>
        )}
      </div>
    </Column>
  );
};

export default VestingDisplay;
