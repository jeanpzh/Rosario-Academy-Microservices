import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getAthleteDistribution = async () => {
  const response = await fetch(`${USER_URL}/athletes-distribution`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error fetching athlete distribution')
  }

  const data =  await response.json()
  return data
}

export function useFetchAthleteDistribution() {
  return useQuery({
    queryKey: ['athleteDistribution'],
    queryFn: getAthleteDistribution,
    staleTime: 1000 * 60 * 5
  })
}
