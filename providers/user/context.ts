import { createContext } from "react";

import { UserStateI } from "@/lib/types";

// Create a context with initial state
const UserContext = createContext<UserStateI>({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isPending: false,
});

export default UserContext;
