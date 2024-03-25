import { cn } from "@/lib/utils";

export const Loader = ({ className }: { className: string }): JSX.Element => {
  return <div className={cn("conic animate-spin duration-1250", className)} />;
};
