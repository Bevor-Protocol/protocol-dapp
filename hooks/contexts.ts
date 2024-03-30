import { useContext } from "react";

import { ModalContext } from "@/providers/modal";
import { ModalStateI, UserStateI } from "@/lib/types";
import { UserContext } from "@/providers/user";

export const useModal = (): ModalStateI => useContext(ModalContext);

export const useUser = (): UserStateI => useContext(UserContext);
