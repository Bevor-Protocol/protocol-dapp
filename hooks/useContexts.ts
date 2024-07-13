import ToastContext from "@/providers/toast/context";
import ModalContext from "@/providers/modal/context";
import SiweContext from "@/providers/siwe/context";
import { ToastStateI, ModalStateI, SiweStateI } from "@/utils/types/providers";
import { useContext, useEffect } from "react";

export const useModal = (): ModalStateI => useContext(ModalContext);
export const useSiwe = (): SiweStateI => useContext(SiweContext);

export const useToast = ({
  autoClose,
  autoCloseTime,
}: {
  autoClose?: boolean;
  autoCloseTime?: number;
} = {}): ToastStateI => {
  const toast = useContext(ToastContext);

  useEffect(() => {
    toast.setAutoClose(autoClose ?? false);
    toast.autoCloseTime.current = autoCloseTime ?? 5_000;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose, autoCloseTime]);

  return {
    toggleOpen: toast.toggleOpen,
    setContent: toast.setContent,
    setReadyAutoClose: toast.setReadyAutoClose,
  };
};
