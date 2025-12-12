import React, { ReactNode, useCallback, useState } from "react";
import ModalContext from "./ModalContext";
import { UseModalReturn } from "@/types";

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = useCallback((modalName: string, data: any = null) => {
    setCurrentModal(modalName);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
    setModalData(null);
  }, []);

  const value: UseModalReturn = {
    currentModal,
    modalData,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
