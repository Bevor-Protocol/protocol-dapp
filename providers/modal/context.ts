import { createContext } from "react";

import { ModalStateI } from "@/lib/types";

const ModalContext = createContext<ModalStateI>({
  toggleOpen: () => {},
  setContent: () => {},
  togglePanelOpen: () => {},
  setPanelContent: () => {},
});

export default ModalContext;
