import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

interface PaymentEnrollmentRequest {
  status: 'rejected' | 'approved' | 'pending'
  requested_schedule_id: {
    plan_id: string
    schedule_id: string
  }
}

export function useFetchEnrollmentRequests({ userId }: { userId: string }) {
  return useQuery({
    queryKey: ['enrollmentRequests', userId],
    queryFn: async (): Promise<PaymentEnrollmentRequest> => {
      const response = await fetch(
        `${API_BASE_URL}/athletes/${userId}/enrollment-requests`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) {
        throw new Error('Error fetching enrollment requests')
      }

      const data = await response.json()
      console.log({ DATAAA: data })
      return data
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000
  })
}
