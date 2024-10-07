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
  // describes the caller component's intent to close the toast
  const [isOpen, setIsOpen] = useState(false);
  // describes the context's actual mounting or unmounting of the toast
  const [toastMounted, setToastMounted] = useState(false);
  // is auto-close is true, this tells us to kick off the timer for when to close the toast
  const [isReadyAutoClose, setIsReadyAutoClose] = useState(false);
  // whether the toast should start its out animation
  const [animateOut, setAnimateOut] = useState(false);
  // the child component of the toast wrapper
  const [content, setContent] = useState<React.ReactNode>(null);
  // whether the toast component can auto close, or requires an explicit close
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  // direction/location of the toast component, called on a per-component basis.
  // can safely call this as we unmount once closed.
  const [direction, setDirection] = useState<"bottom-right" | "bottom-center">("bottom-right");
  const autoCloseTime = useRef(5_000);

  useEffect(() => {
    if (!toastMounted && !isOpen) return;
    // explicit open (always the case for open)
    if (!toastMounted && isOpen) {
      setToastMounted(true);
      return;
    }
    // explicit close (only applicable when not auto closing)
    if (toastMounted && !isOpen) {
      setToastMounted(false);
      setIsReadyAutoClose(false);
      return;
    }

    if (toastMounted && !shouldAutoClose) return;
    // condition not met to start the auto close timeout.
    if (toastMounted && shouldAutoClose && !isReadyAutoClose) return;

    const timeoutAnimate = setTimeout(() => {
      setAnimateOut(true);
    }, autoCloseTime.current - 500);

    const timeout = setTimeout(() => {
      setToastMounted(false);
      setIsReadyAutoClose(false);
      setAnimateOut(false);
      setIsOpen(false);
    }, autoCloseTime.current);

    return () => {
      clearTimeout(timeoutAnimate);
      clearTimeout(timeout);
    };
  }, [isOpen, shouldAutoClose, isReadyAutoClose, toastMounted]);

  const eventState = {
    setIsOpen,
    setContent,
    setIsReadyAutoClose,
    setShouldAutoClose,
    setDirection,
    autoCloseTime,
  };

  return (
    <EventContext.Provider value={eventState}>
      {children}
      <Toast.Wrapper isOpen={toastMounted} animateOut={animateOut} direction={direction}>
        {content}
      </Toast.Wrapper>
    </EventContext.Provider>
  );
};

export default ToastProvider;
