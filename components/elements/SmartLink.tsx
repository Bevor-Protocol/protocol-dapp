import Link from "next/link";

export default ({
  children,
  external,
  href,
  className,
  ...props
}: {
  children: React.ReactNode;
  external: boolean;
  href: string;
  className: string;
}): JSX.Element => {
  if (external) {
    return (
      <a {...props} href={href} className={className} target="_blank" referrerPolicy="no-referrer">
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href} className={className}>
      {children}
    </Link>
  );
};
