import { Modal } from "antd";
import { MODAL_COMPONENTS } from "../../../config/modals.config";
import { useModal } from "../../../hooks/ui";

const ModalManager = () => {
  const { currentModal, modalData, closeModal } = useModal();

  if (!currentModal) return null;

  const ModalComponent = MODAL_COMPONENTS[currentModal];

  if (!ModalComponent){
    console.error(`Modal "${currentModal}" no encontrado.`);
    return null;
  }

  return (
    <Modal
      open={true}
      onCancel={closeModal}
      footer={null}
      destroyOnHidden
      width={600}
    >
      <ModalComponent 
        data={modalData}
        onConfirm={() => {
          modalData?.onConfirm?.()
          closeModal()
        }}
        onCancel={closeModal}
      />
    </Modal>
  )
}

export default ModalManager;