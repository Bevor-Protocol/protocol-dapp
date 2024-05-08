import { createContext } from "react";

import { UserStateI } from "@/lib/types";

// Create a context with initial state
const UserContext = createContext<UserStateI>({
  login: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
  setIsRequestingAccountChange: () => {},
  isAuthenticated: false,
  isPendingSign: false,
  isPendingConnect: false,
  isRequestingAccountChange: false,
  isRejected: false,
});

export default UserContext;
