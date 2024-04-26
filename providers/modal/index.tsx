"use client";

import { useState, useRef, useReducer, useEffect } from "react";

import { ModalStateI } from "@/lib/types";
import * as Modal from "@/components/Modal";
import * as Panel from "@/components/Panel";
import ModalContext from "./context";

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
