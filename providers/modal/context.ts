import { createContext } from "react";

import { ModalStateI } from "@/lib/types";

const ModalContext = createContext<ModalStateI>({
  toggleOpen: () => {},
  setContent: () => {},
});

export default ModalContext;
