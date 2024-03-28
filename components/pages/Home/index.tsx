"use client";
// import { useEffect, useState } from "react";
import { HomeStatI } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/Card";
import { HomeStatSkeleton } from "@/components/Loader";

export const HomeStat = ({ action, symbol, text, queryKey }: HomeStatI): JSX.Element => {
  // I converted this to a client component since it's not important for user interaction
  // and it CAN block the wagmi connector. I was seeing reconnecting -> disconnected -> connected
  // state in wagmi, which made it lose its interactivity.
  const { data, isLoading } = useQuery({
    queryKey: ["homestats", queryKey],
    queryFn: () => action(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
  });

  if (isLoading) return <HomeStatSkeleton />;

  return (
    <Card hover className="text-center p-6 items-center justify-center">
      <p className="text-lg font-bold">{`${symbol || ""}${data?.toLocaleString()}`}</p>
      <p className="text-sm">{text}</p>
    </Card>
  );
};
