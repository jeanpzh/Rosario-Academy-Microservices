import { AssistantFormData } from '@/app/dashboard/admin/schemas/assistant-schema'
import { useAssistantStore } from '@/lib/stores/useAssistantStore'
import { useModalStore } from '@/lib/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/config'

export function useUpdateAssistant() {
  const { closeModal } = useModalStore()
  const { currentItem } = useAssistantStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AssistantFormData) => {
      const response = await fetch(
        `${API_BASE_URL}/worker/assistant/${currentItem.id}`,
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
        throw new Error('Error al actualizar el auxiliar')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
      closeModal()
      toast.success('El auxiliar administrativo fue actualizado con éxito.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el auxiliar')
    }
  })
}
