import * as Styled from "@/styles/layout.styled";

export default ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <Styled.Layout>{children}</Styled.Layout>;
};
