"use client";

import { useState } from "react";

import { userAction } from "@/actions";
import { Column } from "@/components/Box";
import { LEADERBOARD } from "@/constants/queryKeys";
import { useQueryWithHydration } from "@/hooks/useQueryWithHydration";
import { Leaderboard } from "@/utils/types/custom";
import LeaderboardData from "./data";
import LeaderboardNav from "./nav";

const LeaderboardWrapper = ({ initialData }: { initialData: Leaderboard[] }): JSX.Element => {
  const [listSort, setListSort] = useState("name");
  const [listOrder, setListOrder] = useState<"asc" | "desc">("desc");

  const { data, loading } = useQueryWithHydration({
    queryKey: [LEADERBOARD, listSort, listOrder],
    queryFct: () => userAction.getLeaderboard(listSort, listOrder),
    initialData,
  });

  const handleSearch = (header: string): void => {
    if (header === listSort) {
      const newOrder = listOrder === "asc" ? "desc" : "asc";
      setListOrder(newOrder);
    } else {
      setListSort(header);
      setListOrder("desc");
    }
  };

  return (
    <Column className="leaderboard">
      <LeaderboardNav sort={listSort} order={listOrder} handleSearch={handleSearch} />
      <LeaderboardData data={data} isLoading={loading} />
    </Column>
  );
};

export default LeaderboardWrapper;
