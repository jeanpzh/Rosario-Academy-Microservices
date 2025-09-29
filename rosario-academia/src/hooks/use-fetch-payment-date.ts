import { PAYMENT_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getPaymentDate = async (athleteId: string) => {
  const response = await fetch(
    `${PAYMENT_URL}/payment/athlete/${athleteId}/payments`,
    {
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch payment date')
  }

  const { data } = await response.json()
  const paymentDate = data[0].payment_date
  return paymentDate
}

export function useFetchPaymentDateQuery(athleteId: string) {
  return useQuery({
    queryKey: ['paymentDate', athleteId],
    queryFn: ({ queryKey }) => getPaymentDate(queryKey[1] as string),
    staleTime: 1000 * 60 * 5
  })
}
