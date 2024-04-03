import Link from "next/link";

import { cn } from "@/lib/utils";
import React from "react";

interface PropsI extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  asButton?: boolean;
  href: string;
}

const DynamicLink: React.FC<PropsI> = ({
  children,
  className,
  href,
  asButton = false,
  disabled = false,
}): JSX.Element => {
  // Anchor tags don't actually have "disabled" attributes like buttons do, so handle that with css.
  // According to HTML5, we can wrap anchor tags around non-interactive elements. Not a button, or link.
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
        "appearance-none no-underline font-inherit rounded-lg cursor-pointer text-inherit w-fit h-fit",
        !asButton && "block focus-border",
        asButton && "outline-none focus-visible:outline-none",
        disabled && "cursor-default pointer-events-none disabled *:opacity-disable",
        !disabled && "pointer-events-auto",
        className,
      )}
      tabIndex={disabled ? -1 : undefined}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
