import { PAYMENT_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

// Hook para obtener datos de pago desde el microservicio
export function usePaymentData(athleteId?: string) {
  return useQuery({
    queryKey: ['allPaymentData', athleteId],
    queryFn: async () => {
      if (!athleteId) {
        throw new Error('Athlete ID is required')
      }

      const response = await fetch(
        `${PAYMENT_URL}/payment/athlete/${athleteId}/all-data`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch payment data')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred')
      }

      return result.data
    },
    enabled: !!athleteId
  })
}
