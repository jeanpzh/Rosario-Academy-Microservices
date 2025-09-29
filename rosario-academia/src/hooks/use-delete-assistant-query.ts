import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssistantAction } from "@/app/dashboard/actions/assistantActions";
import { toast } from "sonner";

export function useDeleteAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = toast.promise(deleteAssistantAction(id), {
        loading: "Eliminando auxiliar...",
        success: "El auxiliar fue eliminado con éxito.",
        error: "Error al eliminar auxiliar",
      });
      if ("status" in response && response.status !== 200) {
        throw new Error((await response?.unwrap()).message || "Error al eliminar el auxiliar");
      }
      return response.unwrap();
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["assistants"], (oldData: any[] = []) => {
        return "id" in res ? oldData.filter((assistant) => assistant.id !== res.id) : oldData;
      });
    },
  });
}
