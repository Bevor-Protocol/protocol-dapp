import React from "react";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Row: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={clsx("flex flex-row", className)} {...rest}>
      {children}
    </div>
  );
};

export const Column: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={clsx("flex flex-col", className)} {...rest}>
      {children}
    </div>
  );
};

export const HoverItem: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <Row
      className={clsx(
        "items-center relative rounded-lg transition-colors hover:bg-dark-primary-30",
        className,
      )}
      {...rest}
    >
      {children}
    </Row>
  );
};
