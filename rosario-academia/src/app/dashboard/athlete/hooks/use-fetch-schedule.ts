import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export const useFetchSchedule = ({ athleteId }: { athleteId: string }) => {
  return useQuery({
    queryKey: ['schedule', athleteId],
    queryFn: async (): Promise<Schedule[]> => {
      const response = await fetch(
        `${API_BASE_URL}/athletes/schedule/${athleteId}`,
        {
          credentials: 'include'
        }
      )
      if (!response.ok) {
        throw new Error('Error fetching schedule')
      }
      const data = await response.json()
      console.log('Fetched schedule data:', data)
      return data
    }
  })
}
