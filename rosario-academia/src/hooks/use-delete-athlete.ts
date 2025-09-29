import { deleteAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteAthleteQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (athleteId: string) => {
      return toast.promise(deleteAthleteAction(athleteId), {
        loading: "Eliminando deportista...",
        success: "Deportista eliminado correctamente",
        error: "Error al eliminar deportista",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
}
