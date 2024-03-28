"use client";

import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { UserStateI } from "@/lib/types";
import { getUserProfile } from "@/lib/actions/users";

// Create a context with initial state
export const UserContext = createContext<UserStateI>({
  user: undefined,
  isLoading: false,
  isPending: false,
  isFetching: false,
  isFetched: false,
  isFetchedAfterMount: false,
});

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
