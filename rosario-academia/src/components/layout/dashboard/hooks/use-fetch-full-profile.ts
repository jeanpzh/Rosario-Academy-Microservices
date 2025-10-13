import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export const useFetchFullProfile = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ['fullProfile', userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`${USER_URL}/${userId}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Error fetching full profile')
      }
      const data = await response.json()
      console.log('Fetched profile data:', data)
      return data
    },
    enabled: !!userId,
    staleTime: 0.1 * 60 * 1000
  })
}
