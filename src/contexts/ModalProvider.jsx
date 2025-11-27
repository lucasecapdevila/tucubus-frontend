import { useCallback, useState } from "react";

const ModalProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((modalName, data = null) => {
    setCurrentModal(modalName);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
    setModalData(null);
  }, []);

  const value = {
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
