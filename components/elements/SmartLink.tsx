/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

type PropsI = {
  children: React.ReactNode;
  [key: string]: any;
};

export default ({ children, ...props }: PropsI): JSX.Element => {
  const { href, external, ...rest } = props;

  if (external) {
    return (
      <a {...rest} target="_blank" referrerPolicy="no-referrer" href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
};
