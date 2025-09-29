import { updateStatusAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAthleteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected" | "pending";
    }) => {
      return toast.promise(updateStatusAthleteAction(id, status), {
        loading: "Actualizando estado del atleta...",
        success: "Estado actualizado exitosamente",
        error: (err) => `Error al actualizar el estado: ${err.message}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
}
