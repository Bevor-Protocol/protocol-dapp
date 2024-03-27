import Link from "next/link";

import { cn } from "@/lib/utils";
import React from "react";

interface PropsI extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  disabled?: boolean;
  transition?: boolean;
  href: string;
}

const DynamicLink: React.FC<PropsI> = ({
  children,
  disabled,
  href,
  transition = false,
}): JSX.Element => {
  const regex = /^(http|https):\/\//;
  const isExternal = regex.test(href);

  return (
    <Link
      href={href}
      aria-disabled={disabled}
      passHref={isExternal}
      target={isExternal ? "_blank" : ""}
      referrerPolicy={isExternal ? "no-referrer" : ""}
      className={cn(
        "appearance-none text-inherit no-underline font-inherit \
        rounded-lg cursor-pointer focus-border block",
        disabled && "cursor-default",
        disabled && "pointer-events-none",
        !disabled && "pointer-events-auto",
        disabled && "*:opacity-disable",
        transition && !disabled && "*:hover:opacity-hover",
      )}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
