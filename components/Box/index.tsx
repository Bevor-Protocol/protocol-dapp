import React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  disable?: boolean;
}

export const Row: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={cn("flex flex-row", className)} {...rest}>
      {children}
    </div>
  );
};

export const Column: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={cn("flex flex-col", className)} {...rest}>
      {children}
    </div>
  );
};

export const HoverItem: React.FC<Props> = ({ children, className, disable = false, ...rest }) => {
  return (
    <Row
      className={cn(
        "items-center relative rounded-lg transition-colors",
        !disable && "hover:bg-dark-primary-30",
        className,
      )}
      {...rest}
    >
      {children}
    </Row>
  );
};
