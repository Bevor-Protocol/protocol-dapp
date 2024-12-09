"use client";

import { useEffect, useState } from "react";

import { File, Pencil, Search as SearchIcon } from "@/assets";
import { Column, Row } from "@/components/Box";
import { cn } from "@/utils";

interface InputI extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  className?: string;
  isError?: boolean;
}

interface DropI extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  extensions?: string[];
  text?: string;
  selected: File | undefined;
  setSelected: React.Dispatch<React.SetStateAction<File | undefined>>;
}

interface ImageI extends DropI {
  children: React.ReactNode;
}

interface TextAreaI extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  text?: string;
  className?: string;
  isError?: boolean;
}

interface SearchI extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  text?: string;
  className?: string;
}

interface SelectI extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  placeholder: string;
  isError?: boolean;
}

interface CheckboxI extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string;
  checked: boolean;
}

export const Input: React.FC<InputI> = ({ className, text, type, isError, ...rest }) => {
  return (
    <label className={cn("*:text-sm", className)}>
      {text && <p className="mb-1">{text}</p>}
      <input
        type={type}
        className={cn(
          "appearance-none bg-transparent outline-none w-full",
          "font-inherit px-2 py-1 rounded border border-gray-200/20",
          "focus-input disabled:opacity-80 placeholder:text-gray-400/80",
          isError && "ring-1 ring-red-500",
        )}
        {...rest}
      />
    </label>
  );
};

export const Image: React.FC<ImageI> = ({
  className,
  children,
  selected,
  setSelected,
  extensions = ["jpg", "png", "jpeg"],
  disabled,
  ...rest
}) => {
  const [preview, setPreview] = useState<string>("");
  const [dragged, setDragged] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!selected) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    setSelected(e.target.files[0]);
    const extension = e.target.files[0].name.split(".").pop();
    if (extension && !extensions.includes(extension)) {
      e.target.value = "";
      setInvalid(true);
    } else {
      setSelected(e.target.files[0]);
      setInvalid(false);
    }
  };

  return (
    <div className="w-fit">
      <label className={cn("relative rounded-full group", className)}>
        {preview && (
          <div
            className="absolute inset-0 rounded-full bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${preview})` }}
          />
        )}
        {invalid && (
          <div className="text-xs absolute inset-0 justify-center items-center flex">
            invalid file type
          </div>
        )}
        <div
          className={cn(
            "transition-opacity bg-white/20 absolute inset-0 rounded-full opacity-0",
            "justify-center items-center flex group-hover:opacity-100",
            dragged && "opacity-100",
            disabled && "group-hover:opacity-0",
          )}
        >
          <Pencil height="1rem" width="1rem" fill="white" />
        </div>
        <input
          type="file"
          accept="image/*"
          className={cn(
            "absolute inset-0 appearance-none cursor-pointer rounded-full focus-input",
            "disabled:cursor-default",
          )}
          onChange={handleChange}
          onDragEnter={() => setDragged(true)}
          onDragLeave={() => setDragged(false)}
          onDrop={() => setDragged(false)}
          {...rest}
        />
        {children}
      </label>
    </div>
  );
};

export const Dropbox: React.FC<DropI> = ({
  className,
  disabled,
  text,
  extensions = ["md"],
  selected,
  setSelected,
  ...rest
}) => {
  const [dragged, setDragged] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const extension = e.target.files[0].name.split(".").pop();
    if (extension && !extensions.includes(extension)) {
      e.target.value = "";
      setInvalid(true);
    } else {
      setSelected(e.target.files[0]);
      setInvalid(false);
    }
  };

  return (
    <label className={cn("w-full block *:text-sm pointer-events-none", className)}>
      {text && <p className="my-2">{text}</p>}
      <Column
        className={cn(
          "w-80 h-28 transition-colors justify-center items-center relative",
          "rounded-md border border-dashed border-gray-200/20",
          "hover:bg-dark-primary-30",
          "has-[:focus-visible]:border-blue-300",
          !dragged && "bg-transparent",
          dragged && "bg-dark-primary-30",
          disabled && "opacity-disable pointer-events-none",
        )}
        onDragEnter={() => setDragged(true)}
        onDragLeave={() => setDragged(false)}
        onDrop={() => setDragged(false)}
      >
        {!invalid && (
          <>
            <File height="1.25rem" width="1.25rem" fill="white" />
            <p className="mt-1">Drag and drop your Audit Details here</p>
            <p className="text-xs opacity-disable">supports .md files</p>
          </>
        )}
        {invalid && (
          <>
            <p>Invalid file type</p>
            <p className="text-xs my-1">only supports {extensions.join(",")} files</p>
          </>
        )}
        <input
          type="file"
          accept=".md, .markdown"
          className={cn(
            "absolute inset-0 appearance-none cursor-pointer opacity-0",
            "disabled:cursor-default pointer-events-auto",
          )}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
      </Column>
      {selected && !!selected.name && (
        <p className="text-xs opacity-disable my-1">file chosen: {selected.name}</p>
      )}
      {selected && !selected.name && (
        <p className="text-xs opacity-disable my-1">file already exists, feel free to update it</p>
      )}
      {!selected && <p className="text-xs opacity-disable my-1">no file chosen</p>}
    </label>
  );
};

export const Search: React.FC<SearchI> = ({ children, className, text, ...rest }) => {
  return (
    <div className="min-w-80">
      <label className="w-fit max-w-fit *:text-sm">
        {text && <p className="mb-1">{text}</p>}
        <Row
          className={cn(
            "items-center gap-2 px-3 py-2 rounded border border-gray-200/20 outline-none",
            !!children && "rounded-b-none",
            "focus-within:ring-1 focus-within:ring-blue-300",
          )}
        >
          <SearchIcon height="15px" width="15px" className="opacity-50" />
          <input
            type="search"
            placeholder="Search..."
            className={cn(
              "appearance-none bg-transparent outline-none border-none",
              "font-inherit w-full placeholder:text-gray-400/80",
              "disabled:opacity-80",
              className,
            )}
            {...rest}
          />
        </Row>
      </label>
      {!!children && (
        <div className="border border-gray-200/20 border-t-0 rounded-b py-2 w-full overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export const TextArea: React.FC<TextAreaI> = ({ className, text, isError, ...rest }) => {
  return (
    <label className="*:text-sm">
      {text && <p className="mb-1">{text}</p>}
      <textarea
        className={cn(
          "flex w-full rounded-md border border-gray-200/20 bg-transparent",
          "p-2 shadow-sm placeholder:text-gray-400/80",
          "disabled:cursor-default disabled:opacity-80",
          "focus-input",
          isError && "ring-1 ring-red-500",
          className,
        )}
        {...rest}
      />
    </label>
  );
};

export const Radio: React.FC<InputI> = ({ className, text, isError, ...rest }) => {
  // We can force a form submission response when unchecked by using the hidden type.
  // When disabled, no response will be submitted, so we can fallback to the defaultChecked value.

  // TODO: this is kind of buggy, come back to this.
  return (
    <Row className="gap-2 items-center justify-between *:text-sm">
      {text && <p className={cn(isError && "text-red-500", "whitespace-nowrap")}>{text}</p>}
      <label className="toggle w-fit">
        <input type="hidden" {...rest} value="no" />
        <input type="checkbox" className={cn("toggle", className)} {...rest} value="yes" />
        <span className="toggle" />
      </label>
    </Row>
  );
};

export const Select: React.FC<SelectI> = ({
  children,
  className,
  text,
  placeholder,
  isError,
  ...rest
}) => {
  // the hidden input field ensures that token gets passed even if nothing is submitted.
  // order matters here.
  return (
    <label className={cn("*:text-sm", className)}>
      {text && <p className="mb-1">{text}</p>}
      <input type="hidden" name={rest.name} value="" />
      <select
        className={cn(
          "rounded-md border border-gray-200/20 bg-transparent p-1 focus-input",
          "outline-none font-inherit w-full",
          isError && "ring-1 ring-red-500",
        )}
        {...rest}
      >
        <option className="text-muted-foreground" value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    </label>
  );
};

export const Checkbox: React.FC<CheckboxI> = ({ text, checked, ...rest }) => {
  // the hidden input field ensures that token gets passed even if nothing is submitted.
  // order matters here.
  return (
    <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
      <input
        type="checkbox"
        className={cn(
          "appearance-none bg-transparent checked:bg-primary-light-50",
          "border border-1 border-white",
          "h-3 w-3 rounded-sm focus-input",
        )}
        checked={checked}
        {...rest}
      />
      <p>{text}</p>
    </label>
  );
};
