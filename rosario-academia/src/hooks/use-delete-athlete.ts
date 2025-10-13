import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/config'

export function useDeleteAthleteQuery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (athleteId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/users/athlete/${athleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Error al eliminar deportista')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      toast.success('Deportista eliminado correctamente')
    },
    onError: () => {
      toast.error('Error al eliminar deportista')
    }
  })
}
