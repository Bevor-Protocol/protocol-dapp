import { Column } from "@/components/Box";
import { cn } from "@/utils";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
  animateOut: boolean;
  direction: "bottom-right" | "bottom-center";
}

export const Wrapper: React.FC<Props> = ({ children, isOpen, animateOut, direction, ...rest }) => {
  if (!isOpen) return <></>;
  return (
    <Column
      className={cn(
        "fixed z-[999] bg-black py-2 px-4",
        "rounded-md border border-gray-200/20 gap-2",
        direction === "bottom-right" && "right-2 bottom-2",
        direction === "bottom-center" && "left-1/2 bottom-2",
        direction === "bottom-right" && isOpen && "animate-toast-in-bottom-right",
        direction === "bottom-right" && animateOut && "animate-toast-out-bottom-right",
        direction === "bottom-center" && isOpen && "animate-toast-in-bottom-center",
        direction === "bottom-center" && animateOut && "animate-toast-out-bottom-center",
      )}
      {...rest}
    >
      {children}
    </Column>
  );
};

Wrapper.displayName = "Wrapper";
