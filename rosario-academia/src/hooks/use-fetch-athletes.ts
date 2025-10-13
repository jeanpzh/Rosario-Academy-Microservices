import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getAthletes = async () => {
  const response = await fetch(`${API_BASE_URL}/worker/athletes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Error fetching athletes count')
  }
  return await response.json()
}

export function useFechAthletes() {
  return useQuery({
    queryKey: ['athletes'],
    queryFn: getAthletes,
    staleTime: 1000 * 60 * 5
  })
}
