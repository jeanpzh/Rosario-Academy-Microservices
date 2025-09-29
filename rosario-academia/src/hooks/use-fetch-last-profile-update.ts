import { getLastProfileUpdateDate } from '@/utils/auth/api'
import { getDaysRemaining } from '@/utils/formats'
import { useQuery } from '@tanstack/react-query'

export function useFetchLastProfileUpdateQuery({
  id,
  setDaysRemaining
}: {
  id: string
  setDaysRemaining: (days: number) => void
}) {
  return useQuery({
    queryKey: ['last-profile-update'],
    queryFn: async () => {
      const { data } = await getLastProfileUpdateDate(id)
      const daysRemaining = getDaysRemaining(data)
      setDaysRemaining(daysRemaining)
      return data
    },
    staleTime: 1000 * 60 * 5
  })
}
