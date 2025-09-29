import { updateLevelAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAthleteLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      level,
    }: {
      id: string;
      level: "beginner" | "intermediate" | "advanced";
    }) => {
      return toast.promise(updateLevelAthleteAction(id, level), {
        loading: "Actualizando nivel del atleta...",
        success: "Nivel actualizado exitosamente",
        error: (err) => `Error al actualizar el nivel: ${err.message}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
}
