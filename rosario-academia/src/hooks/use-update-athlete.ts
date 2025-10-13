import { AthleteFormData } from '@/app/dashboard/schemas/athlete-schema'
import { useAthleteModalStore } from '@/lib/stores/useAthleteStore'
import { useModalStore } from '@/lib/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/config'

export function useUpdateAthleteMutation() {
  const { currentItem } = useAthleteModalStore()
  const { closeModal } = useModalStore()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: AthleteFormData) => {
      const response = await fetch(
        `${API_BASE_URL}/users/athlete/${currentItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Error al actualizar el atleta')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      closeModal()
      toast.success('Atleta actualizado exitosamente')
    },
    onError: (err: Error) => {
      toast.error(`Error al actualizar el atleta: ${err.message}`)
    }
  })
}
