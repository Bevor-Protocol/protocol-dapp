import React, { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: React.ReactNode;
}

export const Wrapper = forwardRef<HTMLDivElement, Props>(({ children, open, ...rest }, ref) => {
  if (!open) return <></>;
  return (
    <div
      className="fixed inset-y-0 right-0 z-[999] bg-black w-80 pl-4 py-4 animate-panel"
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

Wrapper.displayName = "Wrapper";
