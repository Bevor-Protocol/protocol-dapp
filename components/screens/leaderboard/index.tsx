"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { userAction } from "@/actions";
import { Column } from "@/components/Box";
import { LEADERBOARD } from "@/constants/queryKeys";
import { UserWithCount } from "@/utils/types/prisma";
import LeaderboardData from "./data";
import LeaderboardNav from "./nav";

const LeaderboardWrapper = ({ initialData }: { initialData: UserWithCount[] }): JSX.Element => {
  const [listSort, setListSort] = useState("name");
  const [listOrder, setListOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useQuery({
    queryKey: [LEADERBOARD, listSort, listOrder],
    queryFn: () => userAction.getLeaderboard(listSort, listOrder),
    initialData,
    refetchOnMount: false,
  });

  const handleSearch = (header: string): void => {
    if (header === listSort) {
      const newOrder = listOrder === "asc" ? "desc" : "asc";
      setListOrder(newOrder);
    } else {
      setListSort(header);
      setListOrder("asc");
    }
  };

  return (
    <Column className="leaderboard">
      <LeaderboardNav sort={listSort} order={listOrder} handleSearch={handleSearch} />
      <LeaderboardData data={data} isLoading={isLoading} />
    </Column>
  );
};

export default LeaderboardWrapper;
