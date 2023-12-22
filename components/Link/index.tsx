import { StyledNextLink, StyledLink } from "./styled";

type PropsI = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export default ({ children, ...props }: PropsI): JSX.Element => {
  const { href, external, disabled, ...rest } = props;

  if (external) {
    return (
      <StyledLink
        {...rest}
        target="_blank"
        referrerPolicy="no-referrer"
        href={href}
        $disabled={disabled}
      >
        {children}
      </StyledLink>
    );
  }

  return (
    <StyledNextLink {...rest} href={href} $disabled={disabled}>
      {children}
    </StyledNextLink>
  );
};
