import { createContext } from "react";

import { EventStateI } from "@/lib/types";

const EventContext = createContext<EventStateI>({
  setStatus: () => {},
  setTxn: () => {},
  txn: "",
});

export default EventContext;
