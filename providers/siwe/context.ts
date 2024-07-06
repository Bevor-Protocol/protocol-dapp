import { createContext } from "react";

import { SiweStateI } from "@/utils/types";

// Create a context with initial state
const SiweContext = createContext<SiweStateI>({
  isSuccess: false,
  isPending: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export default SiweContext;
