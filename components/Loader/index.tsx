import clsx from "clsx";

export const Loader = ({ className }: { className: string }): JSX.Element => {
  return <div className={clsx("conic animate-spin duration-1250", className)} />;
};
