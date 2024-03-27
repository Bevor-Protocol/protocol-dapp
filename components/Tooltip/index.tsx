"use client";

import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  target: string;
  shouldShow?: boolean;
}

export const Reference: React.FC<Props> = ({
  children,
  className,
  target,
  shouldShow = true,
  ...rest
}) => {
  const handleToolTip = (): void => {
    const el = document.querySelector(`[data-tooltip-target="${target}"]`) as HTMLDivElement;
    if (!el) return;
    if (shouldShow) {
      el.style.display = "block";
    }
  };

  const clearToolTip = (): void => {
    const el = document.querySelector(`[data-tooltip-target="${target}"]`) as HTMLDivElement;
    if (!el) return;
    el.style.display = "none";
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseOver={handleToolTip}
      onMouseOut={clearToolTip}
      {...rest}
    >
      {children}
    </div>
  );
};

export const Content: React.FC<Props> = ({ children, className, target, ...rest }) => {
  return (
    <div
      className={cn("absolute z-[999]", className)}
      style={{ display: "none" }}
      data-tooltip-target={target}
      {...rest}
    >
      {children}
    </div>
  );
};
