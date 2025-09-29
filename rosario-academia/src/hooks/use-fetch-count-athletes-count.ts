import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getAthletesCount = async () => {
  const response = await fetch(`${USER_URL}/athletes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Error fetching athletes count')
  }
  const { data: athletes } = await response.json()
  return athletes.length
}

export function useCountAthletesQuery() {
  return useQuery({
    queryKey: ['athletesCount'],
    queryFn: getAthletesCount,
    staleTime: 1000 * 60 * 5
  })
}
