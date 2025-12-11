import { useContext } from "react";
import { UseModalReturn } from "@/types";
import { ModalContext } from "@/contexts";

const useModal = (): UseModalReturn => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal debe usarse dentro de un ModalProvider");
  }

  return context;
};

export default useModal;
