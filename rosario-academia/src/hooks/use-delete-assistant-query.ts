import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/config'

export function useDeleteAssistant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/worker/assistant/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el auxiliar')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
      toast.success('El auxiliar fue eliminado con éxito.')
    },
    onError: () => {
      toast.error('Error al eliminar auxiliar')
    }
  })
}
