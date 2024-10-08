"use client";

import { useEffect, useRef, useState } from "react";

import * as Modal from "@/components/Modal";
import * as Panel from "@/components/Panel";
import ModalContext from "./context";

// Modal provider component
const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [open, setOpen] = useState<"modal" | "panel" | "none">("none");
  const [content, setContent] = useState<React.ReactNode>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<undefined | (() => void)>(undefined);

  const panelRef = useRef<HTMLDivElement>(null);
  const handlerPanelRef = useRef<undefined | (() => void)>(undefined);

  useEffect(() => {
    handlerRef.current = open == "modal" ? (): void => setOpen("modal") : undefined;
    handlerPanelRef.current = open == "panel" ? (): void => setOpen("panel") : undefined;

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

  const modalState = {
    setOpen,
    setContent,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      <Modal.Wrapper open={open == "modal"}>
        <Modal.Content ref={contentRef}>{content}</Modal.Content>
      </Modal.Wrapper>
      <Panel.Wrapper open={open == "panel"} ref={panelRef}>
        {content}
      </Panel.Wrapper>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
