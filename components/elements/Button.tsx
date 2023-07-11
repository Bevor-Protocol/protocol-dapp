import * as Styled from "./styled";

type Props = {
  children: React.ReactNode;
  theme: string;
  disabled?: boolean;
};

export default (props: Props): JSX.Element => {
  const { children, theme, disabled } = props;

  return (
    <Styled.Button $light={theme === "light"} disabled={disabled}>
      {children}
    </Styled.Button>
  );
};
