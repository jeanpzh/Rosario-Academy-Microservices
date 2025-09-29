import { updateAthleteAction } from "@/app/dashboard/actions/athleteActions";
import { AthleteFormData } from "@/app/dashboard/schemas/athlete-schema";
import { useAthleteModalStore } from "@/lib/stores/useAthleteStore";
import { useModalStore } from "@/lib/stores/useModalStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAthleteMutation() {
  const { currentItem } = useAthleteModalStore();
  const { closeModal } = useModalStore();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AthleteFormData) => {
      return toast.promise(updateAthleteAction(data, currentItem.id), {
        loading: "Actualizando atleta...",
        success: "Atleta actualizado exitosamente",
        error: (err) => `Error al actualizar el atleta: ${err.message}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      closeModal();
    },
  });
}
