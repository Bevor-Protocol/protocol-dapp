"use client";

import { useEffect, useRef, useState } from "react";

import * as Toast from "@/components/Toast";
import EventContext from "./context";

// TODO: implement 'content' as a queue? Would safely allow for N children of the toast
// TODO: but, each each 'content' would have their own timer? Come back to this.

// To allow for a smooth transition out, we set a timer for animate-out with Xms duration,
// so once the intent of closing the toast is called, we don't actually unmount for Xms.
// The alternative is to never unmount, but i don't want this behavior since the child
// content often changes.
const ToastProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoClose, setAutoClose] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [direction, setDirection] = useState<"bottom-right" | "bottom-center">("bottom-right");
  const autoCloseTime = useRef(5_000);

  useEffect(() => {
    if (!isOpen) return;

    let timeout: NodeJS.Timeout;
    if (autoClose) {
      timeout = setTimeout(() => {
        setAutoClose(false);
        setIsOpen(false);
      }, autoCloseTime.current);
    }

    return () => clearTimeout(timeout);
  }, [isOpen, autoClose]);

  const eventState = {
    setIsOpen,
    setContent,
    setAutoClose,
    setDirection,
    autoCloseTime,
  };

  return (
    <EventContext.Provider value={eventState}>
      {children}
      <Toast.Wrapper
        isOpen={isOpen}
        direction={direction}
        showProgress={autoClose}
        timing={autoCloseTime.current}
      >
        {content}
      </Toast.Wrapper>
    </EventContext.Provider>
  );
};

export default ToastProvider;
