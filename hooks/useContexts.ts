import ModalContext from "@/providers/modal/context";
import SiweContext from "@/providers/siwe/context";
import ToastContext from "@/providers/toast/context";
import { ModalStateI, SiweStateI, ToastStateI } from "@/utils/types/providers";
import { useContext, useEffect } from "react";

export const useModal = (): ModalStateI => useContext(ModalContext);
export const useSiwe = (): SiweStateI => useContext(SiweContext);

export const useToast = ({
  autoClose = false,
  autoCloseTime = 5_000,
  direction = "bottom-right",
}: {
  autoClose?: boolean;
  autoCloseTime?: number;
  direction?: "bottom-right" | "bottom-center";
} = {}): ToastStateI => {
  const toast = useContext(ToastContext);

  useEffect(() => {
    toast.setAutoClose(autoClose);
    toast.setDirection(direction);
    toast.autoCloseTime.current = autoCloseTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseTime, direction]);

  return {
    toggleOpen: toast.toggleOpen,
    setContent: toast.setContent,
    setReadyAutoClose: toast.setReadyAutoClose,
  };
};
