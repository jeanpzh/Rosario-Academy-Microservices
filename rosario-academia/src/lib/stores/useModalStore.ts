import { create } from "zustand";

export type ModalType =
  | "CREATE_ATHLETE"
  | "EDIT_ATHLETE"
  | "CREATE_ASISTENTE"
  | "EDIT_ASISTENTE"
  | "CREATE_PAYMENT"
  | null;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  modalProps?: Record<string, any>;
  openModal: (modalType: ModalType, modalProps?: Record<string, any>) => void;
  setOpenModal: (modalType: ModalType, modalProps?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  modalProps: {},
  openModal: (modalType, modalProps = {}) => set({ isOpen: true, modalType, modalProps }),
  closeModal: () => set({ isOpen: false, modalType: null, modalProps: {} }),
  setOpenModal: (modalType, modalProps = {}) => set({ isOpen: true, modalType, modalProps }),
}));
