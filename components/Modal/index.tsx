import React, { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface PropsDialog extends React.HTMLProps<HTMLDialogElement> {
  children: React.ReactNode;
  className?: string;
}

interface PropsDiv extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export const Wrapper = forwardRef<HTMLDialogElement, PropsDialog>(
  ({ children, className, ...rest }, ref) => {
    return (
      <dialog
        className={cn(
          "bg-transparent border-none z-[9999] text-inherit w-full h-full",
          "flex justify-center items-center",
          "backdrop:bg-black/70 backdrop:backdrop-blur-[2px] backdrop:pointer-events-none",
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </dialog>
    );
  },
);

Wrapper.displayName = "Wrapper";

export const Content = forwardRef<HTMLDivElement, PropsDiv>(
  ({ children, className, isOpen, ...rest }, ref) => {
    if (!isOpen) return <></>;
    return (
      <div
        className={cn("border rounded-lg max-w-[80%] max-h-[80%] bg-dark", className)}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Content.displayName = "Content";
