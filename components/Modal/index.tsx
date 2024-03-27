import React, { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: React.ReactNode;
}

export const Wrapper: React.FC<Props> = ({ children, open }) => {
  if (!open) return <></>;
  return (
    <div
      className={cn(
        "fixed inset-0 flex justify-center items-center z-[999]",
        "bg-black/70 backdrop-blur-1",
      )}
    >
      {children}
    </div>
  );
};

export const Content = forwardRef<HTMLDivElement, Props>(({ children, open, ...rest }, ref) => {
  if (!open) return <></>;
  return (
    <div className="border rounded-lg max-w-[80%] max-h-[80%] bg-dark" ref={ref} {...rest}>
      {children}
    </div>
  );
});

Content.displayName = "Content";
