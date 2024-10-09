import { Column } from "@/components/Box";
import { cn } from "@/utils";
import React, { useEffect, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
  showProgress: boolean;
  direction: "bottom-right" | "bottom-center";
  timing: number;
}

export const Wrapper: React.FC<Props> = ({
  children,
  isOpen,
  direction,
  showProgress,
  timing,
  ...rest
}) => {
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
    <Column
      className={cn(
        "fixed z-[999] bg-black p-4 w-56 overflow-hidden",
        "rounded-md border border-gray-200/20 gap-2",
        direction === "bottom-right" && "right-2 bottom-2",
        direction === "bottom-center" && "left-1/2 bottom-2",
        direction === "bottom-right" && isOpen && "animate-toast-in-bottom-right",
        direction === "bottom-right" && !isOpen && "animate-toast-out-bottom-right",
        direction === "bottom-center" && isOpen && "animate-toast-in-bottom-center",
        direction === "bottom-center" && !isOpen && "animate-toast-out-bottom-center",
      )}
      {...rest}
    >
      {children}
      {showProgress && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary-50 animate-shrink"
          style={{ animationDuration: `${timing}ms` }}
        />
      )}
    </Column>
  );
};

Wrapper.displayName = "Wrapper";
