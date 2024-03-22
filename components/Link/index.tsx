import Link from "next/link";
import clsx from "clsx";

type PropsI = {
  children: React.ReactNode;
  disabled?: boolean;
  transition?: boolean;
  href: string;
};

const DynamicLink = ({ children, disabled, href, transition = false }: PropsI): JSX.Element => {
  const regex = /^(http|https):\/\//;
  const isExternal = regex.test(href);

  return (
    <Link
      href={href}
      aria-disabled={disabled}
      passHref={isExternal}
      target={isExternal ? "_blank" : ""}
      referrerPolicy={isExternal ? "no-referrer" : ""}
      className={clsx(
        "appearance-none text-inherit no-underline font-inherit \
        rounded-lg cursor-pointer focus-border block",
        {
          "cursor-default": disabled,
          "pointer-events-none": disabled,
          "pointer-events-auto": !disabled,
          "*:opacity-disable": disabled,
          "*:hover:opacity-hover": transition && !disabled,
        },
      )}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
