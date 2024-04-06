"use client";

import { useState, useRef, useReducer, useEffect } from "react";

import { ModalStateI } from "@/lib/types";
import * as Modal from "@/components/Modal";
import ModalContext from "./context";

// Modal provider component
const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isOpen, toggleOpen] = useReducer((s) => !s, false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<undefined | (() => void)>(isOpen ? toggleOpen : undefined);

  useEffect(() => {
    handlerRef.current = isOpen ? toggleOpen : undefined;
  }, [isOpen]);

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
    if (isOpen) {
      document.body.classList.add("modal-show");
    } else {
      document.body.classList.remove("modal-show");
    }
  }, [isOpen]);

  const modalState: ModalStateI = {
    toggleOpen,
    setContent,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      <Modal.Wrapper open={isOpen}>
        <Modal.Content open={isOpen} ref={contentRef}>
          {content}
        </Modal.Content>
      </Modal.Wrapper>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
