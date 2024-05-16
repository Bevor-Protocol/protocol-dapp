"use client";

import { useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { useClient } from "wagmi";
import { Abi, Address } from "viem";

import { Button } from "@/components/Button";
import { AuditI } from "@/lib/types";
import BevorABI from "@/contracts/abis/BevorProtocol";

const Withdraw = ({ audit }: { audit: AuditI }): JSX.Element => {
  const [percent, setPercent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [cliff, setCliff] = useState(0);
  const client = useClient();

  useEffect(() => {
    if (!client) return;
    readContract(client, {
      address: BevorABI.address as Address,
      abi: BevorABI.abi as Abi,
      functionName: "audits",
      args: [audit.onchainAuditInfoId],
    }).then((result: unknown) => {
      const typedResult = result as [
        Address,
        Address,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        boolean,
      ];
      setStartTime(Number(typedResult[5]));
      setDuration(Number(typedResult[3]));
      const cliffAudit = Number(typedResult[4]);
      const cliffPercent = (100 * cliffAudit) / Number(typedResult[5]);
      setCliff(cliffPercent);
    });
  }, [client, audit.onchainAuditInfoId]);

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
    alert("Call withdraw method from SC");
  };

  return (
    <div className="text-sm font-medium text-center">
      <h3>Vesting Progress</h3>
      <p className="text-xs mt-1 text-right">{Math.round(percent * 100) / 100}%</p>
      <div className="relative h-2 overflow-x-hidden rounded-full bg-primary-light-20 w-full">
        <div
          className="h-full w-full flex-1 bg-white transition-all"
          style={{ transform: `translateX(-${100 - (percent || 0)}%)` }}
        />
        <div
          className="absolute w-[1px] h-3 bg-white top-1/2 -translate-y-1/2"
          style={{ left: `${cliff}%` }}
        />
      </div>
      <div className="flex justify-end mt-4 mb-2 w-full">
        <Button type="reset" onClick={withdraw} disabled={true}>
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
