"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getLeaderboard } from "@/lib/actions/users";
import LeaderboardData from "./data";
import LeaderboardNav from "./nav";
import { UserWithCount } from "@/lib/types/actions";
import { Column } from "@/components/Box";
import { LeaderboardSkeleton } from "@/components/Loader";

const LeaderboardWrapper = ({ initialData }: { initialData: UserWithCount[] }): JSX.Element => {
  const [listSort, setListSort] = useState("name");
  const [listOrder, setListOrder] = useState("asc");

  const { data, isFetching } = useQuery({
    queryKey: ["leaderboard", listSort, listOrder],
    queryFn: () => getLeaderboard(listSort, listOrder),
    initialData,
  });

  const handleSearch = (header: string): void => {
    if (header === listSort) {
      const newOrder = listOrder === "asc" ? "desc" : "asc";
      setListOrder(newOrder);
    } else {
      setListSort(header);
    }
  };

  return (
    <Column className="leaderboard">
      <LeaderboardNav sort={listSort} order={listOrder} handleSearch={handleSearch} />
      {isFetching ? <LeaderboardSkeleton nItems={data.length} /> : <LeaderboardData data={data} />}
    </Column>
  );
};

export default LeaderboardWrapper;
