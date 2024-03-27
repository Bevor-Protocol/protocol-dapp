"use client";
import { useRef } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  dropdown: {
    isShowing: boolean;
    toggle: () => void;
  };
}

export const Main: React.FC<Props> = ({ children, className, dropdown, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, dropdown.isShowing ? dropdown.toggle : undefined);
  return (
    <div className={cn("relative", className)} ref={ref} {...rest}>
      {children}
    </div>
  );
};

export const Trigger: React.FC<Props> = ({ children, dropdown, ...rest }) => {
  return (
    <div onClick={dropdown.toggle} {...rest}>
      {children}
    </div>
  );
};

export const Content: React.FC<Props> = ({ children, className, dropdown, ...rest }) => {
  if (!dropdown.isShowing) return <></>;
  return (
    <div className={cn("absolute z-[999] cursor-default", className)} {...rest}>
      {children}
    </div>
  );
};
