import { createContext } from "react";

import { UserStateI } from "@/lib/types";

// Create a context with initial state
const UserContext = createContext<UserStateI>({
  login: () => {},
  logout: () => {},
  authenticate: () => {},
  isAuthenticated: false,
  isPending: false,
  isRejected: false,
});

export default UserContext;
