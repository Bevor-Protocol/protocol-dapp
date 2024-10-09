import { cn } from "@/utils";
import React, { forwardRef, useEffect, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Wrapper = forwardRef<HTMLDivElement, Props>(({ children, isOpen, ...rest }, ref) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }

    return (): void => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!isVisible) return <></>;
  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-[999] bg-black w-80 px-2 py-4",
        isOpen && "animate-panel-in",
        !isOpen && "animate-panel-out",
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

Wrapper.displayName = "Wrapper";
