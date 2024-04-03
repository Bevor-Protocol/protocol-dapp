"use client";

import { createContext, useState, useRef, useReducer, useEffect } from "react";

import { ModalStateI } from "@/lib/types";
import * as Modal from "@/components/Modal";
import { useClickOutside } from "@/hooks/useClickOutside";

// Create a context with initial state
export const ModalContext = createContext<ModalStateI>({
  toggleOpen: () => {},
  setContent: () => {},
});

// Modal provider component
const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isOpen, toggleOpen] = useReducer((s) => !s, false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside(contentRef, isOpen ? toggleOpen : undefined);

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
