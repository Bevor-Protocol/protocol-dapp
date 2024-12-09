"use client";
// import { useEffect, useState } from "react";
import * as Card from "@/components/Card";
import { code } from "@/components/font";
import { HomeStatSkeleton } from "@/components/Loader";
import { HOME_STATS } from "@/constants/queryKeys";
import { cn } from "@/utils";
import { ProtocolStat } from "@/utils/types/custom";
import { useQuery } from "@tanstack/react-query";

export const HomeStat = ({ action, symbol, text, queryKey }: ProtocolStat): JSX.Element => {
  // I converted this to a client component since it's not important for user interaction
  // and it CAN block the wagmi connector. I was seeing reconnecting -> disconnected -> connected
  // state in wagmi, which made it lose its interactivity.

  // The slower requests still block others from completing.
  const { data, isLoading } = useQuery({
    queryKey: [HOME_STATS, queryKey],
    queryFn: () => action(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
  });

  if (isLoading) return <HomeStatSkeleton />;

  return (
    <Card.Main hover className="text-center p-6 items-center justify-center xs:p-4">
      <div>
        <p
          className={cn("text-lg font-bold", code.className)}
        >{`${symbol || ""}${data?.toLocaleString()}`}</p>
        <p className="text-sm">{text}</p>
      </div>
    </Card.Main>
  );
};
