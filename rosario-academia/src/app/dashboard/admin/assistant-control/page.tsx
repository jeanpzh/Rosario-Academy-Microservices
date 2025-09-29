"use client";
import Header from "@/app/dashboard/components/Header";
import AssistantManage from "@/app/dashboard/admin/assistant-control/components/AssistantManage";
import CustomTable from "@/app/dashboard/components/CustomTable";
import { columns } from "@/lib/columns/assitant-column";
import { Assistant } from "@/lib/types/AssistantTable";
import { useAssistantQuery } from "@/hooks/use-fetch-assistant-query";
import { useDeleteAssistant } from "@/hooks/use-delete-assistant-query";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useAssistantStore } from "@/lib/stores/useAssistantStore";

export default function AssistantControlPage() {
  // Global State for Edit or Create Modal and current item for Assistant
  const { setOpenModal } = useModalStore();
  const { setCurrentItem: setAssistant } = useAssistantStore();
  // Fetch Assistants
  const { data: assistants = [], isLoading } = useAssistantQuery();
  // Delete assistant mutation
  const deleteMutation = useDeleteAssistant();
  // Handle Assistant Edit
  const handleEdit = (item: Assistant) => {
    item.birth_date = new Date(item.birth_date).toISOString().split("T")[0];
    setAssistant(item);
    setOpenModal("EDIT_ASISTENTE");
  };
  // Handle Assistant Delete
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="dark:bg-dark-surface flex flex-col gap-4 bg-background p-4">
      <Header title="Control de Auxiliares" />
      <AssistantManage />
      <CustomTable
        columns={columns(handleEdit, handleDelete)}
        data={assistants}
        isLoading={isLoading}
      />
    </div>
  );
}
