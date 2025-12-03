'use client'

import { API_BASE_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const createPaymentRecord = async (athleteId: string, formData: Payment) => {
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
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al crear el pago')
  }

  return response.json()
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
      queryClient.invalidateQueries({ queryKey: ['athletesWithPayments'] })
      toast.success('¡Pago registrado exitosamente!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el pago')
    }
  })
}
