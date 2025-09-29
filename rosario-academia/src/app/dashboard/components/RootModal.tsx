"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalStore } from "@/lib/stores/useModalStore";
import AthleteForm from "./athletes/AthleteForm";
import AssistantForm from "../admin/assistant-control/components/AssistantForm";
import { PaymentModal } from "./athletes/PaymentModal";

const ModalRoot = () => {
  const { isOpen, modalType, closeModal } = useModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        {modalType === "CREATE_ATHLETE" && <AthleteForm mode="create" />}
        {modalType === "EDIT_ATHLETE" && <AthleteForm mode="edit" />}
        {modalType === "CREATE_ASISTENTE" && <AssistantForm mode="create" />}
        {modalType === "EDIT_ASISTENTE" && <AssistantForm mode="edit" />}
        {modalType === "CREATE_PAYMENT" && <PaymentModal />}
      </DialogContent>
    </Dialog>
  );
};

export default ModalRoot;
