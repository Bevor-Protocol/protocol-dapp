import classNames from "classnames";
import styles from "@/styles/elements.module.css";

type Props = {
  children: React.ReactNode;
  theme: string;
  disabled?: boolean;
};

export default (props: Props): JSX.Element => {
  const { children, theme, disabled } = props;

  return (
    <button
      className={classNames(styles.btn, {
        [styles.light]: theme === "light",
        [styles.dark]: theme === "dark",
      })}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
