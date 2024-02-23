import { useEffect, useRef } from "react";

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
