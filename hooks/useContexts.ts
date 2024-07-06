import EventContext from "@/providers/events/context";
import ModalContext from "@/providers/modal/context";
import SiweContext from "@/providers/siwe/context";
import { EventStateI, ModalStateI, SiweStateI } from "@/utils/types";
import { useContext } from "react";

export const useModal = (): ModalStateI => useContext(ModalContext);
export const useSiwe = (): SiweStateI => useContext(SiweContext);
export const useEvent = (): EventStateI => useContext(EventContext);
