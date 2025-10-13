import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export const useFetchPaymentsById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async (): Promise<PaymentWithEndDate[]> => {
      const response = await fetch(`${API_BASE_URL}/payment/athlete/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Error fetching payments')
      }
      const data = await response.json()
      console.log('Fetched payments data:', data)
      return data
    },
    // Refrescar automáticamente cuando la ventana recupera el foco
    refetchOnWindowFocus: true,
    // Los datos siempre se consideran obsoletos para forzar refetch
    staleTime: 0
  })
}
