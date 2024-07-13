import { createContext } from "react";

import { ModalStateI } from "@/utils/types/providers";

const ModalContext = createContext<ModalStateI>({
  toggleOpen: () => {},
  setContent: () => {},
});

export default ModalContext;
