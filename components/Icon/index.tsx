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
};

interface Props extends React.HTMLAttributes<HTMLElement> {
  size: string;
  image?: string | null;
  seed?: string | null;
  className?: string;
}

export const Icon: React.FC<Props> = ({ size, image, seed, className, ...rest }): JSX.Element => {
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

export const Social = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div
      className="flex justify-center items-center relative rounded-full
p-1 border border-transparent transition-colors hover:bg-dark-primary-30"
    >
      {children}
    </div>
  );
};
