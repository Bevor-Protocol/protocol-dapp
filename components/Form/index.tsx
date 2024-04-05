"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Column, Row } from "@/components/Box";
import { Search as SearchIcon, Pencil, File } from "@/assets";

interface InputI extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  className?: string;
  isError?: boolean;
}

interface DropI extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  extensions?: string[];
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
    <label className={cn("w-80 block group *:text-sm", className)}>
      <p className="my-2">Audit Details</p>
      <Column
        className={cn(
          "w-full h-28 transition-colors justify-center items-center relative",
          "rounded-md border border-gray-200/20 bg-transparent",
          "group-hover:bg-dark-primary-30",
          dragged && "bg-dark-primary-30",
          disabled && "group-hover:hidden",
        )}
        onDragEnter={() => setDragged(true)}
        onDragLeave={() => setDragged(false)}
        onDrop={() => setDragged(false)}
      >
        {selected && (
          <>
            <p className="text-xs my-1">{selected.name}</p>
            <File height="1rem" width="1rem" fill="white" />
          </>
        )}
        {!selected && !invalid && (
          <>
            <p>Drag and Drop your Audit Details file here</p>
            <p className="text-xs my-1">supports .md files</p>
            <File height="1rem" width="1rem" fill="white" />
          </>
        )}
        {!selected && invalid && (
          <>
            <p>Invalid file type</p>
            <p className="text-xs my-1">only supports {extensions.join(",")} files</p>
          </>
        )}
        <input
          type="file"
          accept=".md, .markdown"
          className={cn(
            "absolute inset-0 appearance-none cursor-pointer focus-input opacity-0",
            "disabled:cursor-default",
          )}
          onChange={handleChange}
          {...rest}
        />
      </Column>
    </label>
  );
};

export const Search: React.FC<SearchI> = ({ children, className, text, ...rest }) => {
  return (
    <div className="w-80 min-w-80">
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
