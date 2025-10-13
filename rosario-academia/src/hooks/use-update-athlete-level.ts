import { API_BASE_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const updateAthleteLevel = async ({
  id,
  level
}: {
  id: string
  level: 'beginner' | 'intermediate' | 'advanced'
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/worker/${id}/athlete/level`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ level })
    })
    if (!response.ok) {
      throw new Error('Error updating athlete level')
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Error updating athlete level')
  }
}

export function useUpdateAthleteLevel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      level
    }: {
      id: string
      level: 'beginner' | 'intermediate' | 'advanced'
    }) => {
      return toast.promise(updateAthleteLevel({ id, level }), {
        loading: 'Actualizando nivel del atleta...',
        success: 'Nivel actualizado exitosamente',
        error: (err) => `Error al actualizar el nivel: ${err.message}`
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['athletes'],
        refetchType: 'all'
      })
    }
  })
}
