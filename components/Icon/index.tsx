import React from "react";
import { cn } from "@/lib/utils";

const sizeMapper: Record<string, Record<string, string>> = {
  xs: {
    desktop: "20px",
    mobile: "20px",
  },
  sm: {
    desktop: "25px",
    mobile: "25px",
  },
  md: {
    desktop: "30px",
    mobile: "25px",
  },
  lg: {
    desktop: "75px",
    mobile: "60px",
  },
  xl: {
    desktop: "90px",
    mobile: "75px",
  },
  xxl: {
    desktop: "120px",
    mobile: "90px",
  },
};

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
  const { desktop, mobile } = sizeMapper[size];

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
          "--height-desktop": desktop,
          "--height-mobile": mobile,
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
