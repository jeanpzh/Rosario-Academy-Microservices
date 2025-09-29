import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getProfile = async (userId?: string) => {
  const response = await fetch(`${USER_URL}/me/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error fetching profile')
  }

  const data = await response.json()
  return data
}

export function useFetchProfileQuery(userId?: string) {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(userId),
    staleTime: 1000 * 60 * 5
  })
}
