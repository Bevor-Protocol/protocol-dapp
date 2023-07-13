import Link from "next/link";
import styled, { css } from "styled-components";

const LinkStyle = css`
  appearance: none;
  color: inherit;
  text-decoration: none;
  font-family: inherit !important;
  cursor: pointer;

  :active,
  :focus {
    outline: none;
    border: none;
  }
`;

export const StyledNextLink = styled(Link)`
  ${LinkStyle}
`;

export const StyledLink = styled.a`
  ${LinkStyle}
`;

type PropsI = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export default ({ children, ...props }: PropsI): JSX.Element => {
  const { href, external, ...rest } = props;

  if (external) {
    return (
      <StyledLink {...rest} target="_blank" referrerPolicy="no-referrer" href={href}>
        {children}
      </StyledLink>
    );
  }

  return (
    <StyledNextLink {...rest} href={href}>
      {children}
    </StyledNextLink>
  );
};
