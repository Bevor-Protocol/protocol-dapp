import { createContext } from "react";

import { ModalStateI } from "@/utils/types";

const ModalContext = createContext<ModalStateI>({
  toggleOpen: () => {},
  setContent: () => {},
});

export default ModalContext;
