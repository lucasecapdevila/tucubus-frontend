import CascadeDeleteModal from "@/components/common/CascadeDeleteModal";
import React from "react";

export const MODAL_TYPES = {
  CASCADE_DELETE: "CASCADE_DELETE",
  BULK_DELETE: "BULK_DELETE",
  FORM: "FORM",
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];

interface ModalComponentProps {
  data: any
  onConfirm: () => void
  onCancel: () => void
}

export const MODAL_COMPONENTS: Record <string, React.FC<ModalComponentProps>> = {
  [MODAL_TYPES.CASCADE_DELETE]: CascadeDeleteModal,
};
