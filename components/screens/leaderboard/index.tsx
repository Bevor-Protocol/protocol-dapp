"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { userController } from "@/actions";
import LeaderboardData from "./data";
import LeaderboardNav from "./nav";
import { UserWithCount } from "@/utils/types/prisma";
import { Column } from "@/components/Box";
import { LEADERBOARD } from "@/constants/queryKeys";

const LeaderboardWrapper = ({ initialData }: { initialData: UserWithCount[] }): JSX.Element => {
  const [listSort, setListSort] = useState("name");
  const [listOrder, setListOrder] = useState("asc");

  const { data } = useQuery({
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
      <LeaderboardData data={data} />
    </Column>
  );
};

export default LeaderboardWrapper;
