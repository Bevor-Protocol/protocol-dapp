import { Children, isValidElement, ReactElement, ReactNode } from "react";

export const filterChildren = (children: ReactNode, name: string): ReactElement => {
  return Children.toArray(children).find((child) => {
    if (isValidElement(child) && typeof child.type !== "string" && "displayName" in child.type) {
      return child.type.displayName == name;
    }
    return false;
  }) as ReactElement;
};
