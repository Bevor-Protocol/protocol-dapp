import React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      className={cn(
        "flex flex-row outline-none border-none rounded-md font-semibold",
        "py-2 px-4 dim disabled:opacity-disable",
        "text-dark text-sm gap-1",
        "grad-light",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
