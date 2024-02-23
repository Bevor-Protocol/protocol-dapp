import { useEffect } from "react";

export const useCloseDialog = (
  node: React.RefObject<HTMLDialogElement | undefined>,
  handler: () => void,
): void => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (!node.current) return;
      const rect = node.current.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        node.current.close();
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return (): void => document.removeEventListener("mousedown", handleClickOutside);
  }, [node, handler]);
};
