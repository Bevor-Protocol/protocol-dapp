"use client";

import { createContext, useState, useRef } from "react";

import { ModalStateI } from "@/lib/types";
import { Card } from "@/components/Card";
import { useCloseDialog } from "@/hooks/useCloseDialog";

// Create a context with initial state
export const ModalContext = createContext<ModalStateI>({
  isOpen: false,
  toggleOpen: () => {},
  setContent: () => {},
});

// Modal provider component
const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const ref = useRef<HTMLDialogElement>(null);
  useCloseDialog(ref, () => setIsOpen(false));

  const toggleOpen = (): void => {
    if (!ref.current) return;
    if (isOpen) {
      ref.current.close();
      setContent(null);
    } else {
      ref.current.showModal();
    }
    setIsOpen(!isOpen);
  };

  const modalState: ModalStateI = {
    isOpen,
    toggleOpen,
    setContent,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      {/* Without this conditional, the <ModalContent> still shows */}
      <dialog ref={ref}>
        {isOpen && <Card className="h-[400px] max-h-[75%] w-[300px] max-w-[80%]">{content}</Card>}
      </dialog>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
