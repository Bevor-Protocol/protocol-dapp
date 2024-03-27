import { cn } from "@/lib/utils";
import { Row } from "../Box";
import { Search as SearchIcon } from "@/assets";

interface InputI extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  className?: string;
}

interface TextAreaI extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  text?: string;
  className?: string;
}

export const Input: React.FC<InputI> = ({ className, text, type, ...rest }) => {
  return (
    <label className="w-fit max-w-fit *:text-xs">
      {text && <p className="text-xs mb-1">{text}</p>}
      <input
        className={cn(
          "appearance-none bg-transparent outline-none",
          "font-inherit w-full px-2 py-1 rounded border border-gray-200/20",
          "focus-input",
          "disabled:cursor-text disabled:text-inherit disabled:border-transparent",
          type == "text" && "w-48",
          type == "number" && "w-28",
          className,
        )}
        {...rest}
      />
    </label>
  );
};

export const Search: React.FC<InputI> = ({ className, text, ...rest }) => {
  return (
    <label className="w-fit max-w-fit *:text-xs">
      {text && <p className="text-xs mb-1">{text}</p>}
      <Row
        className={cn(
          "items-center gap-2 px-3 py-2 rounded border border-gray-200/20 outline-none w-56",
          "has-[:focus-visible]:rounded-b-none",
        )}
      >
        <SearchIcon height="15px" width="15px" className="opacity-50" />
        <input
          type="search"
          placeholder="Search..."
          className={cn(
            "appearance-none bg-transparent outline-none border-none",
            "font-inherit w-full",
            "disabled:cursor-text disabled:text-inherit disabled:border-transparent",
            className,
          )}
          {...rest}
        />
      </Row>
    </label>
  );
};

export const TextArea: React.FC<TextAreaI> = ({ className, text, ...rest }) => {
  return (
    <label className="*:text-xs">
      {text && <p className="mb-1">{text}</p>}
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-gray-200/20 bg-transparent",
          "px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-input",
          className,
        )}
        {...rest}
      />
    </label>
  );
};

export const Radio: React.FC<InputI> = ({ className, text, ...rest }): JSX.Element => {
  return (
    <Row className="gap-2 items-center justify-between">
      {text && <p className="text-xs">{text}</p>}
      <label className="toggle w-fit">
        <input type="checkbox" className={cn("toggle", className)} {...rest} />
        <span className="toggle" />
      </label>
    </Row>
  );
};
