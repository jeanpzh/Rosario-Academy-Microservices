import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getAssistants = async () => {
  const response = await fetch(`${USER_URL}/assistants`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Error fetching assistants count')
  }
  const { data: assistants } = await response.json()
  return assistants
}
const getAssistantCount = async () => {
  const assistants = await getAssistants()
  return assistants.length
}
export function useCountAssistantQuery() {
  return useQuery({
    queryKey: ['assistantsCount'],
    queryFn: getAssistantCount,
    staleTime: 1000 * 60 * 5
  })
}
