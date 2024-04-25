"use client";

import { useState, useRef, useReducer, useEffect } from "react";

import { ModalStateI } from "@/lib/types";
import * as Modal from "@/components/Modal";
import * as Panel from "@/components/Panel";
import ModalContext from "./context";

// Modal provider component
const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isOpen, toggleOpen] = useReducer((s) => !s, false);
  const [isPanelOpen, togglePanelOpen] = useReducer((s) => !s, false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [panelContent, setPanelContent] = useState<React.ReactNode>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<undefined | (() => void)>(isOpen ? toggleOpen : undefined);

  const panelRef = useRef<HTMLDivElement>(null);
  const handlerPanelRef = useRef<undefined | (() => void)>(
    isPanelOpen ? togglePanelOpen : undefined,
  );

  useEffect(() => {
    handlerRef.current = isOpen ? toggleOpen : undefined;
    handlerPanelRef.current = isPanelOpen ? togglePanelOpen : undefined;
  }, [isOpen, isPanelOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        if (handlerRef.current) handlerRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [contentRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (handlerPanelRef.current) handlerPanelRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-show");
    } else {
      document.body.classList.remove("modal-show");
    }
  }, [isOpen]);

  const modalState: ModalStateI = {
    toggleOpen,
    setContent,
    togglePanelOpen,
    setPanelContent,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      <Modal.Wrapper open={isOpen}>
        <Modal.Content open={isOpen} ref={contentRef}>
          {content}
        </Modal.Content>
      </Modal.Wrapper>
      <Panel.Wrapper open={isPanelOpen} ref={panelRef}>
        {panelContent}
      </Panel.Wrapper>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
