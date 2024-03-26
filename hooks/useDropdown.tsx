import { useReducer } from "react";

type DropdownHook = {
  isShowing: boolean;
  toggle: () => void;
};

export const useDropdown = (): DropdownHook => {
  const [isShowing, toggle] = useReducer((s) => !s, false);

  return { isShowing, toggle };
};
