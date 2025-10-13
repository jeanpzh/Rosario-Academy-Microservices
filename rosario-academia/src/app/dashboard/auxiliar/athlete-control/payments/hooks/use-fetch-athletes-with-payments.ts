import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getAthletesWithPayments = async (): Promise<AthleteWithPayments[]> => {
  const response = await fetch(
    `${API_BASE_URL}/worker/athletes-with-payments`,
    {
      credentials: 'include'
    }
  )
  return response.json()
}

export const useFetchAthletesWithPayments = () => {
  return useQuery({
    queryKey: ['athletesWithPayments'],
    queryFn: getAthletesWithPayments
  })
}
