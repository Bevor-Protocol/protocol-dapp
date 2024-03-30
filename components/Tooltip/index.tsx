"use client";

import { cn } from "@/lib/utils";
import React, { cloneElement, forwardRef, useRef } from "react";
import { filterChildren } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  shouldShow?: boolean;
}

export const Reference: React.FC<Props> = ({ children, className, shouldShow = true, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleToolTip = (): void => {
    if (!ref.current) return;
    if (shouldShow) {
      ref.current.style.display = "block";
    }
  };

  const clearToolTip = (): void => {
    if (!ref.current) return;
    ref.current.style.display = "none";
  };

  const childAddRef = filterChildren(children, "Tooltip.Content");
  const childNoRef = filterChildren(children, "Tooltip.Trigger");

  return (
    <div
      className={cn("relative", className)}
      onMouseOver={handleToolTip}
      onMouseOut={clearToolTip}
      {...rest}
    >
      {childNoRef}
      {cloneElement(childAddRef, { ref })}
    </div>
  );
};

export const Trigger: React.FC<Props> = ({ children }) => {
  return children;
};

Trigger.displayName = "Tooltip.Trigger";

export const Content: React.FC<Props> = forwardRef<HTMLDivElement, Props>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div
        className={cn("absolute z-[999] text-xs", className)}
        style={{ display: "none" }}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Content.displayName = "Tooltip.Content";
