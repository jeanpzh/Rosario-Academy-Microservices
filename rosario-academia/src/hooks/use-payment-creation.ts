"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPaymentRecord,
  fetchPaymentMethods,
  getAthleteById,
} from "@/app/dashboard/actions/athleteActions";

export function usePaymentCreation(athleteId: string) {
  const queryClient = useQueryClient();

  // Obtener datos del atleta mediante acción de servidor
  const { data: athlete, isLoading: isLoadingAthlete } = useQuery({
    queryKey: ["athlete", athleteId],
    queryFn: async () => {
      return getAthleteById(athleteId);
    },
  });

  // Obtener métodos de pago mediante acción de servidor
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      return fetchPaymentMethods();
    },
  });

  // Crear el registro de pago y suscripción mediante acción de servidor
  const createPaymentMutation = useMutation({
    mutationFn: async (formData: Payment) => {
      return createPaymentRecord(athleteId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete", athleteId] });
      queryClient.invalidateQueries({ queryKey: ["payments", athleteId] });
    },
  });

  // Función para crear pago con notificaciones toast
  const createPayment = async (formData: Payment) => {
    return toast.promise(createPaymentMutation.mutateAsync(formData), {
      loading: "Creando registro de pago...",
      success: "¡Pago registrado exitosamente!",
      error: (err) => `Error al registrar el pago: ${err.message}`,
      position: "bottom-left",
    });
  };

  return {
    athlete,
    paymentMethods,
    isLoading: isLoadingAthlete || isLoadingPaymentMethods,
    createPayment,
    isPending: createPaymentMutation.isPending,
  };
}
