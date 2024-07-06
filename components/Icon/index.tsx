import React from "react";
import { cn } from "@/utils";
import { iconSizeMapper } from "@/constants/sizes";

interface IconI extends React.HTMLAttributes<HTMLElement> {
  size: string;
  image?: string | null;
  seed?: string | null;
  className?: string;
}

interface SocialI extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Icon: React.FC<IconI> = ({ size, image, seed, className, ...rest }) => {
  const { desktop, mobile } = iconSizeMapper[size];

  let urlUse = `url(https://avatar.vercel.sh/${seed?.replace(/\s/g, "")})`;
  if (image) {
    urlUse = `url(${image})`;
  }
  return (
    <div
      className={cn("avatar", className)}
      style={
        {
          backgroundImage: urlUse,
          "--size-desktop": desktop,
          "--size-mobile": mobile,
        } as React.CSSProperties
      }
      {...rest}
    />
  );
};

export const Social: React.FC<SocialI> = ({ children, className, ...rest }) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center rounded-full p-1",
        "border border-transparent transition-colors hover:bg-dark-primary-30",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
