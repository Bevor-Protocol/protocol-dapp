import React from "react";

export type ModalStateI = {
  toggleOpen: (s?: string) => void;
  setContent: (content: React.ReactNode) => void;
};

export type ToastStateI = {
  toggleOpen: React.DispatchWithoutAction;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setReadyAutoClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ToastContextI = {
  toggleOpen: React.DispatchWithoutAction;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setReadyAutoClose: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoClose: React.Dispatch<React.SetStateAction<boolean>>;
  setDirection: React.Dispatch<React.SetStateAction<"bottom-right" | "bottom-center">>;
  autoCloseTime: React.MutableRefObject<number>;
};

export type SiweStateI = {
  isPending: boolean;
  isSuccess: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
