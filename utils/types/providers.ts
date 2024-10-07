import React from "react";

export type ModalStateI = {
  toggleOpen: (s?: string) => void;
  setContent: (content: React.ReactNode) => void;
};

export type ToastStateI = {
  show: (options: {
    autoClose?: boolean;
    autoCloseReady?: boolean;
    autoCloseTime?: number;
    direction?: "bottom-right" | "bottom-center";
    content: React.ReactNode;
  }) => void;
  hide: () => void;
  isReadyAutoClose: () => void;
};

export type ToastContextI = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setIsReadyAutoClose: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldAutoClose: React.Dispatch<React.SetStateAction<boolean>>;
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
