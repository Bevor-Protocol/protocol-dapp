"use client";

import { createContext, useState, useRef, useCallback } from "react";

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
  const [content, setContent] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback((): void => {
    if (!ref.current) return;
    if (ref.current.open) {
      ref.current.close();
      setContent(null);
    } else {
      ref.current.showModal();
    }
  }, [ref]);

  useClickOutside(contentRef, ref.current?.open ? toggleOpen : undefined);

  const modalState: ModalStateI = {
    toggleOpen,
    setContent,
  };
  console.log(ref.current?.open);
  return (
    <ModalContext.Provider value={modalState}>
      {children}
      {/* Without this conditional, the <ModalContent> still shows */}
      <Modal.Wrapper ref={ref}>
        <Modal.Content isOpen={ref.current?.open} ref={contentRef}>
          {content}
        </Modal.Content>
      </Modal.Wrapper>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
