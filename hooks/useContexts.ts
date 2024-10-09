import ModalContext from "@/providers/modal/context";
import SiweContext from "@/providers/siwe/context";
import ToastContext from "@/providers/toast/context";
import { ModalStateI, SiweStateI, ToastStateI } from "@/utils/types/providers";
import { useContext } from "react";

export const useSiwe = (): SiweStateI => useContext(SiweContext);

// rather than using the ToastContext directly, we create an abstraction
// over it, since there's no need to require all underlying logic in a component.
export const useToast = (): ToastStateI => {
  const toast = useContext(ToastContext);

  const show = ({
    autoClose = false,
    autoCloseTime = 5_000,
    direction = "bottom-right",
    content,
  }: {
    autoClose?: boolean;
    autoCloseTime?: number;
    direction?: "bottom-right" | "bottom-center";
    content: React.ReactNode;
  }): void => {
    toast.setContent(content);
    toast.setAutoClose(autoClose);
    toast.setDirection(direction);
    toast.setIsOpen(true);
    toast.autoCloseTime.current = autoCloseTime;
  };

  return {
    show,
    hide: () => toast.setIsOpen(false),
    autoClose: () => toast.setAutoClose(true),
  };
};

export const usePanel = (): ModalStateI => {
  const panel = useContext(ModalContext);

  const show = (content: React.ReactNode): void => {
    panel.setOpen("panel");
    panel.setContent(content);
  };

  return {
    show,
    hide: () => panel.setOpen("none"),
  };
};

export const useModal = (): ModalStateI => {
  const panel = useContext(ModalContext);

  const show = (content: React.ReactNode): void => {
    panel.setOpen("modal");
    panel.setContent(content);
  };

  return {
    show,
    hide: () => panel.setOpen("none"),
  };
};
