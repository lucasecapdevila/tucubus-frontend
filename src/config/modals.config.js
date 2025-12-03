import { CascadeDeleteModal } from "../components/common";

export const MODAL_TYPES = {
  CASCADE_DELETE: "CASCADE_DELETE",
  BULK_DELETE: "BULK_DELETE",
  FORM: "FORM",
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CASCADE_DELETE]: CascadeDeleteModal,
};
