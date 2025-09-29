import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export function useFetchLastAvatarChangeQuery({
  setLastAvatarChange,
  id
}: {
  setLastAvatarChange: any
  id: string
}) {
  const getLastAvatarDate = async () => {
    const response = await fetch(
      `${USER_URL}/athlete/${id}/latest-avatar-change`,
      {
        credentials: 'include'
      }
    )
    if (!response.ok) {
      throw new Error('Error fetching last avatar change date')
    }
    return await response.json()
  }
  return useQuery({
    queryKey: ['last-avatar-change'],
    queryFn: async () => {
      const res = await getLastAvatarDate()
      if (!res) throw new Error('No data received for last avatar change')
      setLastAvatarChange(res.data)
      return res.data
    },
    staleTime: 1000 * 60 * 5
  })
}
