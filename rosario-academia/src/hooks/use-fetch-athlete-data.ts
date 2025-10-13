import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export function useFetchAthleteData({ userId }: { userId?: string }) {
  return useQuery({
    queryKey: ['athlete-data', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const response = await fetch(`${API_BASE_URL}/athletes/${userId}`, {
        credentials: 'include'
      })

      if (!response.ok) throw new Error('Failed to fetch athlete data')
      const data = await response.json()
      console.log('Fetched athlete data:', data)
      return data
    }
  })
}
