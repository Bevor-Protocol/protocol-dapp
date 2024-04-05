"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Row } from "@/components/Box";
import { Search as SearchIcon, Pencil } from "@/assets";

interface InputI extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  className?: string;
  isError?: boolean;
}

interface ImageI extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children: React.ReactNode;
  selected: File | undefined;
  setSelected: React.Dispatch<React.SetStateAction<File | undefined>>;
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

export const Input: React.FC<InputI> = ({ className, text, type, isError, ...rest }) => {
  return (
    <label className="w-fit max-w-fit *:text-sm">
      {text && <p className="mb-1">{text}</p>}
      <input
        className={cn(
          "appearance-none bg-transparent outline-none",
          "font-inherit px-2 py-1 rounded border border-gray-200/20",
          "focus-input disabled:opacity-80",
          type == "text" && "w-48",
          type == "number" && "w-28",
          isError && "ring-1 ring-red-500",
          className,
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
  disabled,
  ...rest
}) => {
  const [preview, setPreview] = useState<string>("");

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
        <div
          className={cn(
            "transition-opacity bg-white/20 absolute inset-0 rounded-full opacity-0",
            "justify-center items-center hidden group-hover:flex group-hover:opacity-100",
            disabled && "group-hover:hidden",
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
          {...rest}
        />
        {children}
      </label>
    </div>
  );
};

export const Search: React.FC<SearchI> = ({ children, className, text, ...rest }) => {
  return (
    <div className="w-60 min-w-60">
      <label className="w-fit max-w-fit *:text-sm">
        {text && <p className="mb-1">{text}</p>}
        <Row
          className={cn(
            "items-center gap-2 px-3 py-2 rounded border border-gray-200/20 outline-none",
            "rounded-b-none",
          )}
        >
          <SearchIcon height="15px" width="15px" className="opacity-50" />
          <input
            type="search"
            placeholder="Search..."
            className={cn(
              "appearance-none bg-transparent outline-none border-none",
              "font-inherit w-full",
              "disabled:opacity-80",
              className,
            )}
            {...rest}
          />
        </Row>
      </label>
      <div className="border border-gray-200/20 border-t-0 rounded-b py-2 w-full overflow-hidden">
        {children}
      </div>
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
          "p-2 shadow-sm placeholder:text-muted-foreground",
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

export const Radio: React.FC<InputI> = ({ className, text, isError, ...rest }): JSX.Element => {
  return (
    <Row className="gap-2 items-center justify-between *:text-sm">
      {text && <p className={cn(isError && "text-red-500")}>{text}</p>}
      <label className="toggle w-fit">
        <input type="checkbox" className={cn("toggle", className)} {...rest} />
        <span className="toggle" />
      </label>
    </Row>
  );
};
