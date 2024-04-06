import { useEffect, useRef, useState, useContext } from "react";

import { UserStateI, ModalStateI } from "./types";
import UserContext from "@/providers/user/context";
import ModalContext from "@/providers/modal/context";

export const useModal = (): ModalStateI => useContext(ModalContext);
export const useUser = (): UserStateI => useContext(UserContext);

export const useClickOutside = (
  node: React.RefObject<HTMLElement | undefined>,
  handler: undefined | (() => void),
): void => {
  const handlerRef = useRef<undefined | (() => void)>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (node.current && !node.current.contains(e.target as Node)) {
        if (handlerRef.current) handlerRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [node]);
};

export const useIsMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
};
