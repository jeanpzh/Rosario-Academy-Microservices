"use client";

import { Plus } from "lucide-react";
import { HoverBorderGradient } from "@/components/hover-border-gradient";
import { useModalStore } from "@/lib/stores/useModalStore";

export default function AssistantManage() {
  const { setOpenModal } = useModalStore();
  // For form provider and resolver
  const handleAddAssistant = () => setOpenModal("CREATE_ASISTENTE");

  return (
    <div className="mb-4 flex items-center justify-between bg-background p-4 shadow-sm">
      <HoverBorderGradient onClick={handleAddAssistant} className="flex items-center">
        <Plus className="mr-2 size-4" />
        Nuevo Auxiliar Administrativo
      </HoverBorderGradient>
    </div>
  );
}
