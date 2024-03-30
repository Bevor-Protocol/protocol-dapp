import React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  title: string;
  className?: string;
}

export const Toggle: React.FC<Props> = ({ active, title, className, ...rest }) => {
  return (
    <div
      className={cn(
        "text-sm cursor-pointer relative transition-opacity after-underline",
        !active && "opacity-disable",
        !active && "hover:opacity-hover",
        !active && "after:bg-transparent",
        className,
      )}
      data-name={title}
      {...rest}
    >
      {title}
    </div>
  );
};
