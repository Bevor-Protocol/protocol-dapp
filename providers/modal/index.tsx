"use client";

import { createContext, useState, useRef, useReducer } from "react";

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

  const modalState: ModalStateI = {
    toggleOpen,
    setContent,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      {/* Without this conditional, the <ModalContent> still shows */}
      <Modal.Wrapper open={isOpen}>
        <Modal.Content open={isOpen} ref={contentRef}>
          {content}
        </Modal.Content>
      </Modal.Wrapper>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
