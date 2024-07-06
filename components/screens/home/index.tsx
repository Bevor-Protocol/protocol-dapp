"use client";
// import { useEffect, useState } from "react";
import { HomeStatI } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import * as Card from "@/components/Card";
import { HomeStatSkeleton } from "@/components/Loader";
import { HOME_STATS } from "@/constants/queryKeys";

export const HomeStat = ({ action, symbol, text, queryKey }: HomeStatI): JSX.Element => {
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
    <Card.Main hover className="text-center p-6 items-center justify-center">
      <p className="text-lg font-bold">{`${symbol || ""}${data?.toLocaleString()}`}</p>
      <p className="text-sm">{text}</p>
    </Card.Main>
  );
};
