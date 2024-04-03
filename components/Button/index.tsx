import React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: string;
}

export const Button: React.FC<Props> = ({ variant = "outline", className, children, ...rest }) => {
  return (
    <button
      className={cn(
        variant == "gradient" && "btn-gradient grad-light",
        variant == "outline" && "btn-outline",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
