import { cn } from "@/utils";
import { Column } from "@/components/Box";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open: boolean;
}

export const Wrapper: React.FC<Props> = ({ children, open, ...rest }) => {
  if (!open) return <></>;
  return (
    <Column
      className={cn(
        "fixed right-2 bottom-2 z-[999] bg-black py-2 px-4",
        "rounded-md border border-gray-200/20 gap-2",
        "animate-toast-in",
      )}
      {...rest}
    >
      {children}
    </Column>
  );
};

Wrapper.displayName = "Wrapper";
