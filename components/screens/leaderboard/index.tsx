"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { userController } from "@/actions";
import LeaderboardData from "./data";
import LeaderboardNav from "./nav";
import { UserWithCount } from "@/utils/types/prisma";
import { Column } from "@/components/Box";
import { LeaderboardSkeleton } from "@/components/Loader";
import { LEADERBOARD } from "@/constants/queryKeys";

const LeaderboardWrapper = ({ initialData }: { initialData: UserWithCount[] }): JSX.Element => {
  const [listSort, setListSort] = useState("name");
  const [listOrder, setListOrder] = useState("asc");

  const { data, isFetching } = useQuery({
    queryKey: [LEADERBOARD, listSort, listOrder],
    queryFn: () => userController.getLeaderboard(listSort, listOrder),
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
