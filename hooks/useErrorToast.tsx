import ErrorToast from "@/components/Toast/Content/error";
import { useToast } from "./useContexts";

export const useErrorToast = (): (() => void) => {
  const {
    toggleOpen: toggleToast,
    setContent,
    setReadyAutoClose,
  } = useToast({ autoClose: true, direction: "bottom-center" });

  return () => {
    setContent(<ErrorToast text="something went wrong, try again later" />);
    toggleToast();
    setReadyAutoClose(true);
  };
};
