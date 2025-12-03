import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export const useFetchInitUrl = (data: {
  userId: string
  planId: string
  scheduleId: string
}) => {
  return useQuery({
    queryKey: ['init-url', data.userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/payment/preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: data.userId,
          planId: data.planId,
          schedule_id: data.scheduleId
        })
      })
      if (!response.ok) {
        console.error('Error fetching init URL:', {
          status: response.status,
          statusText: response.statusText
        })
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      return result
    },
    enabled: false
  })
}
