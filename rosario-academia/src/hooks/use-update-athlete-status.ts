import { updateStatusAthleteAction } from '@/app/dashboard/actions/athleteActions'
import { API_BASE_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const updateAthleteStatus = async ({
  id,
  status
}: {
  id: string
  status: 'approved' | 'rejected' | 'pending'
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/worker/${id}/athlete/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      }
    )
    if (!response.ok) {
      throw new Error('Error updating athlete status')
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Error updating athlete status')
  }
}

export function useUpdateAthleteStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string
      status: 'approved' | 'rejected' | 'pending'
    }) => {
      return updateAthleteStatus({ id, status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['athletes'],
        refetchType: 'all'
      })
    }
  })
}
