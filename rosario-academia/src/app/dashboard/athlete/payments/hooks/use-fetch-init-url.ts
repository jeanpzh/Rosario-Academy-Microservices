import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export const useFetchInitUrl = (data: {
  userId: string
  planId: string
  scheduleId: number
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
          planId: '61c0ae93-df4e-4bc7-847b-42b4dcc07cea',
          schedule_id: 2
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
