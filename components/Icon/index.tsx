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
}

export const Icon = ({ size, image, seed, ...rest }: Props): JSX.Element => {
  const { desktop, mobile } = sizeMapper[size];

  let urlUse = `url(https://avatar.vercel.sh/${seed?.replace(/\s/g, "")})`;
  if (image) {
    urlUse = `url(${image})`;
  }
  return (
    <div
      className="avatar"
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
