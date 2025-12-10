import { useContext } from "react";
import { ModalContext } from "../../contexts";
import { UseModalReturn } from "@/types";

const useModal = (): UseModalReturn => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal debe usarse dentro de un ModalProvider");
  }

  return context;
};

export default useModal;
