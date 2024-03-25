import { cn } from "@/lib/utils";

export const Card = ({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}): JSX.Element => {
  return (
    <div
      className={cn(
        "bg-dark shadow rounded-lg flex flex-col",
        hover && "transition-colors hover:bg-dark-primary-30",
        className,
      )}
    >
      {children}
    </div>
  );
};
