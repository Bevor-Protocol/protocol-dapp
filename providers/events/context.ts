import { createContext } from "react";

import { EventStateI } from "@/utils/types";

const EventContext = createContext<EventStateI>({
  setStatus: () => {},
  setTxn: () => {},
  txn: "",
});

export default EventContext;
