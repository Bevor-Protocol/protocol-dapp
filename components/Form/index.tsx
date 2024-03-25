import { cn } from "@/lib/utils";

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

export const Radio: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
): JSX.Element => {
  const { name, ...rest } = props;
  return (
    <div className="flex flex-row gap-2 items-center">
      <p>{name}</p>
      <label htmlFor={name} className="toggle">
        <input id={name} type="checkbox" name={name} className="toggle" {...rest} />
        <span className="toggle" />
      </label>
    </div>
  );
};
