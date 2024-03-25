import React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Ellipses: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={cn("flex px-2 items-center justify-center h-full w-full", className)} {...rest}>
      <div className="flex items-center justify-center gap-[7px]">
        <div className="h-[5px] w-[5px] bg-current rounded-full relative"></div>
        <div className="h-[5px] w-[5px] bg-current rounded-full relative"></div>
        <div className="h-[5px] w-[5px] bg-current rounded-full relative"></div>
      </div>
    </div>
  );
};
