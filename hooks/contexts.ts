import { useContext } from "react";

import { ModalContext } from "@/providers/modal";
import { ModalStateI } from "@/lib/types";

export const useModal = (): ModalStateI => useContext(ModalContext);
