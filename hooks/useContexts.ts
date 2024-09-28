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
}: {
  autoClose?: boolean;
  autoCloseTime?: number;
} = {}): ToastStateI => {
  const toast = useContext(ToastContext);

  useEffect(() => {
    toast.setAutoClose(autoClose);
    toast.autoCloseTime.current = autoCloseTime;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseTime]);

  return {
    toggleOpen: toast.toggleOpen,
    setContent: toast.setContent,
    setReadyAutoClose: toast.setReadyAutoClose,
  };
};
