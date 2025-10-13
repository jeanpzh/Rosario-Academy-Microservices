import { AssistantFormData } from '@/app/dashboard/admin/schemas/assistant-schema'
import { useModalStore } from '@/lib/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/config'

export function useAddAssistantQuery() {
  const { closeModal } = useModalStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AssistantFormData) => {
      const response = await fetch(`${API_BASE_URL}/worker/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar el auxiliar')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
      closeModal()
      toast.success('El auxiliar administrativo fue registrado con éxito.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al registrar el auxiliar')
    }
  })
}
