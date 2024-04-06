import { createContext } from "react";

import { UserStateI } from "@/lib/types";

// Create a context with initial state
const UserContext = createContext<UserStateI>({
  user: undefined,
  isLoading: false,
  isPending: false,
  isFetching: false,
  isFetched: false,
  isFetchedAfterMount: false,
});

export default UserContext;
