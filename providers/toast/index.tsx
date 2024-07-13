"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import * as Toast from "@/components/Toast";
import EventContext from "./context";
import { toggleReducer } from "@/reducers";

// Event provider component
const ToastProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [show, setShow] = useState(false);
  const [readyAutoClose, setReadyAutoClose] = useState(false);
  const [open, toggleOpen] = useReducer(toggleReducer, false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [autoClose, setAutoClose] = useState(false);
  const autoCloseTime = useRef(5_000);

  useEffect(() => {
    if (!show && !open) return;
    // explicit open (always the case for open)
    if (!show && open) {
      setShow(true);
      return;
    }
    // explicit close (only applicable when not auto closing)
    if (show && !open) {
      setShow(false);
      setReadyAutoClose(false);
      return;
    }

    if (show && !autoClose) return;
    // condition not met to start the auto close timeout.
    if (show && autoClose && !readyAutoClose) return;

    const timeout = setTimeout(() => {
      setShow(false);
      setReadyAutoClose(false);
      toggleOpen();
    }, autoCloseTime.current);

    return () => clearTimeout(timeout);
  }, [open, autoClose, readyAutoClose, show]);

  const eventState = {
    toggleOpen,
    setContent,
    setReadyAutoClose,
    setAutoClose,
    autoCloseTime,
  };

  return (
    <EventContext.Provider value={eventState}>
      {children}
      <Toast.Wrapper open={show}>{content}</Toast.Wrapper>
    </EventContext.Provider>
  );
};

export default ToastProvider;
