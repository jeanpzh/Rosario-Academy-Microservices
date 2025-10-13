'use client'

import { API_BASE_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const createPaymentRecord = async (athleteId: string, formData: Payment) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/athlete/${athleteId}/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error('Error al crear el pago')
    }

    return response.json()
  } catch (error) {
    throw new Error('Error al crear el pago')
  }
}

export function usePaymentCreation(athleteId: string) {
  const queryClient = useQueryClient()

  // Crear el registro de pago y suscripción mediante acción de servidor
  return useMutation({
    mutationFn: async (formData: Payment) => {
      return createPaymentRecord(athleteId, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete', athleteId] })
      queryClient.invalidateQueries({ queryKey: ['payments', athleteId] })
    }
  })

  /*  // Función para crear pago con notificaciones toast
  const createPayment = async (formData: Payment) => {
    return toast.promise(createPaymentMutation.mutateAsync(formData), {
      loading: "Creando registro de pago...",
      success: "¡Pago registrado exitosamente!",
      error: (err) => `Error al registrar el pago: ${err.message}`,
      position: "bottom-left",
    });
  }; */
}
