import { cn } from "@/lib/utils";
import { Row } from "../Box";

interface RadioInput extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
}

export const Text: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props): JSX.Element => {
  return (
    <input
      type="text"
      className={cn(
        "appearance-none bg-transparent outline-none:",
        "font-inherit w-48 px-2 py-1 rounded border border-gray-200/20",
        "disabled:cursor-text disabled:text-inherit disabled:border-transparent",
      )}
      {...props}
    />
  );
};

export const Radio: React.FC<RadioInput> = (props): JSX.Element => {
  const { text, name, ...rest } = props;
  return (
    <Row className="gap-2 items-center justify-between">
      <p>{text || name}</p>
      <label htmlFor={name} className="toggle">
        <input id={name} type="checkbox" name={name} className="toggle" {...rest} />
        <span className="toggle" />
      </label>
    </Row>
  );
};
