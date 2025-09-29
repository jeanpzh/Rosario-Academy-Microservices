import { USER_URL } from '@/lib/config'
import { Athlete } from '@/lib/types/AthleteTable'
import { useQuery } from '@tanstack/react-query'

async function getAthletesAction() {
  const res = await fetch(`${USER_URL}/athletes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error('Error al obtener deportistas')
  }
  const { data, error } = await res.json()
  if (error) {
    throw new Error('Error al obtener deportistas')
  }
  return data
}

export function useFetchAthletesQuery() {
  return useQuery<Athlete[]>({
    queryKey: ['athletes'],
    queryFn: getAthletesAction,
    staleTime: 1000 * 60 * 5
  })
}
