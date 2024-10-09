import { createContext, MutableRefObject } from "react";

import { ToastContextI } from "@/utils/types/providers";

const ToastContext = createContext<ToastContextI>({
  setIsOpen: () => {},
  setContent: () => {},
  setAutoClose: () => {},
  setDirection: () => {},
  autoCloseTime: { current: 5_000 } as MutableRefObject<number>,
});

export default ToastContext;
