import { createContext, MutableRefObject } from "react";

import { ToastContextI } from "@/utils/types/providers";

const ToastContext = createContext<ToastContextI>({
  toggleOpen: () => {},
  setContent: () => {},
  setReadyAutoClose: () => {},
  setAutoClose: () => {},
  autoCloseTime: { current: 5_000 } as MutableRefObject<number>,
});

export default ToastContext;
