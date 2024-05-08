"use client";

import { useState, useRef, useReducer, useEffect } from "react";

import { ModalStateI } from "@/lib/types";
import * as Modal from "@/components/Modal";
import * as Panel from "@/components/Panel";
import ModalContext from "./context";
import { getUser } from "@/actions/siwe";
import { useAccount } from "wagmi";
import { useUser } from "@/lib/hooks";
import RequestAccountChange from "@/components/Modal/Content/requestAccountChange";

const reducer = (state: string, action?: string): string => {
  if (state == "none") {
    return action || "modal";
  }
  return "none";
};

// Modal provider component
const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [open, toggleOpen] = useReducer(reducer, "none");
  const [content, setContent] = useState<React.ReactNode>(null);

  const { address } = useAccount();
  const { logout, setIsAuthenticated, setIsRequestingAccountChange } = useUser();

  const contentRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<undefined | (() => void)>(undefined);

  const panelRef = useRef<HTMLDivElement>(null);
  const handlerPanelRef = useRef<undefined | (() => void)>(undefined);

  useEffect(() => {
    handlerRef.current = open == "modal" ? toggleOpen : undefined;
    handlerPanelRef.current = open == "panel" ? toggleOpen : undefined;

    if (open !== "none") {
      document.body.classList.add("modal-show");
    } else {
      document.body.classList.remove("modal-show");
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        if (handlerRef.current) handlerRef.current();
      }
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (handlerPanelRef.current) handlerPanelRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [contentRef, panelRef]);

  useEffect(() => {
    // MUST CALL THIS WITHIN THIS CONTEXT, SO IT CAN ACCESS BOTH toggleOpen()
    // AND the user context.

    // If a user is connected, then every time the address changes (excluding initial connection)
    // present them with the option to switch back to verified account, or log out.
    // This useEffect will also capture instances where they do switch back to the verified acct,
    // in this case, just mark it as authenticated and return.
    const handleChange = (): void => {
      // on account change, except initial connection, re-authenticate.
      getUser().then((user) => {
        console.log(user.address, address, open);
        if (user.success && user.address) {
          if (user.address === address) {
            // captures case where user switched back to authenticated account.
            setIsRequestingAccountChange(false);
            setIsAuthenticated(true);
            if (open == "modal") toggleOpen();
            return;
          }
          if (!address) {
            // captures case where user manually disconnected account.
            return logout();
          }
          // user WAS authenticated, but switched accounts. Present modal.
          setIsRequestingAccountChange(true);
          setContent(<RequestAccountChange verifiedAddress={user.address} />);

          // This effectively prevents the modal from being closed and allowing for a user
          // to navigate the site authenticated as once user, while being connected
          // as a different user.
          if (open == "none") toggleOpen();
          console.log("should toggle open");
        }
      });
    };

    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, open]);

  const modalState: ModalStateI = {
    toggleOpen,
    setContent,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      <Modal.Wrapper open={open == "modal"}>
        <Modal.Content open={open == "modal"} ref={contentRef}>
          {content}
        </Modal.Content>
      </Modal.Wrapper>
      <Panel.Wrapper open={open == "panel"} ref={panelRef}>
        {content}
      </Panel.Wrapper>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
