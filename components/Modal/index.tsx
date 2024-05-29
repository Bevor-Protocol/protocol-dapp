import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: React.ReactNode;
}

export const Wrapper: React.FC<Props> = ({ children, open }) => {
  if (!open) return <></>;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[990] animate-modal">
      {children}
    </div>
  );
};

export const Content = forwardRef<HTMLDivElement, Props>(({ children, open, ...rest }, ref) => {
  if (!open) return <></>;
  return (
    <div
      className={cn(
        "shadow rounded-lg w-[600px] max-w-[80%] max-h-[80%] overflow-scroll",
        "bg-dark p-6 relative animate-appear",
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

Content.displayName = "Content";
