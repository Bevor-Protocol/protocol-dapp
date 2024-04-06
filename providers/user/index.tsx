"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { UserStateI } from "@/lib/types";
import { getUserProfile } from "@/actions/users";
import UserContext from "./context";

// Modal provider component
const UserProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { address } = useAccount();
  const { data, isLoading, isFetching, isFetched, isFetchedAfterMount, isPending } = useQuery({
    queryKey: ["user", address],
    queryFn: () => {
      if (!address) return null;
      return getUserProfile(address as string);
    },
  });

  const userState: UserStateI = {
    user: data,
    isLoading,
    isFetching,
    isPending,
    isFetched,
    isFetchedAfterMount,
  };

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

export default UserProvider;
