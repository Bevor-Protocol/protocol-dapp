"use client";

import { useEffect, useState } from "react";

import { EventStateI } from "@/lib/types";
import * as Toast from "@/components/Toast";
import EventContext from "./context";

// Event provider component
const EventProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [txn, setTxn] = useState("");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("called");
    if (!status) return;
    if (status == "pending") {
      setOpen(true);
      return;
    }

    const timeout = setTimeout(() => {
      setOpen(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [status]);

  const eventState: EventStateI = {
    setStatus,
    setTxn,
    txn,
  };

  return (
    <EventContext.Provider value={eventState}>
      {children}
      <Toast.Wrapper open={open} txn={txn} status={status} />
    </EventContext.Provider>
  );
};

export default EventProvider;
