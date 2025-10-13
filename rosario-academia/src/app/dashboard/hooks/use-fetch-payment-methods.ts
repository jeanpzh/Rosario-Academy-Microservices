import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

const getPaymentMethods = async (): Promise<PaymentMethods[]> => {
  const response = await fetch(`${API_BASE_URL}/payment/methods`, {
    credentials: 'include'
  })
  return response.json()
}

export const useFetchPaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => getPaymentMethods()
  })
}
