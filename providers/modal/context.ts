import { createContext } from "react";

import { ModalContextI } from "@/utils/types/providers";

const ModalContext = createContext<ModalContextI>({
  setOpen: () => {},
  setContent: () => {},
});

export default ModalContext;
