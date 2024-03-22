import clsx from "clsx";

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
      className={clsx(
        "bg-dark shadow rounded-lg flex flex-col transition-colors",
        {
          "hover:bg-dark-primary-20": hover,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};
