import { useEffect, useRef } from "react";

export const useClickOutside = (
  node: React.RefObject<HTMLElement | undefined>,
  handler: undefined | (() => void),
  ignoredNodes: Array<React.RefObject<HTMLElement | undefined>> = [],
): void => {
  const handlerRef = useRef<undefined | (() => void)>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      const nodeClicked = node.current?.contains(e.target as Node);
      const ignoredNodeClicked = ignoredNodes.reduce(
        (reducer, val) => reducer || !!val.current?.contains(e.target as Node),
        false,
      );

      if ((nodeClicked || ignoredNodeClicked) ?? false) {
        return;
      }

      if (handlerRef.current) handlerRef.current();
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [node, ignoredNodes]);
};
