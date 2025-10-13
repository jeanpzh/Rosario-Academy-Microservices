import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getAssistants = async () => {
  const response = await fetch(`${API_BASE_URL}/worker/assistants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Error fetching assistants count')
  }
  const assistants = await response.json()
  console.log({ assistants })
  // Ensure we always return an array
  return Array.isArray(assistants) ? assistants : []
}
export function useFetchAssistants() {
  return useQuery({
    queryKey: ['assistants'],
    queryFn: getAssistants,
    staleTime: 1000 * 60 * 5
  })
}
