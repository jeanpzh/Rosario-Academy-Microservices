import { useState, useCallback } from 'react'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import { PAYMENT_URL, USER_URL } from '@/lib/config'

export function useFetchAthleteData(user: { id?: string }) {
  const setAthleteDetails = useAthleteStore((state) => state.setAthleteData)
  const athleteDetails = useAthleteStore((state) => state.athleteDetails)
  const [isLoading, setLoading] = useState(false)
  const [availableDate, setAvailableDate] = useState<string | null>(null)

  const fetchAthleteData = useCallback(async () => {
    if (!user?.id) {
      console.error('No athlete ID found')
      return
    }
    setLoading(true)
    const athleteId = user.id
    try {
      const res = await fetch(`${USER_URL}/athlete/${athleteId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!res.ok) {
        console.error('Failed to fetch athlete data')
        return
      }
      const data = await res.json()
      if (data.error) {
        return
      }
      const [paymentsResult, enrollmentResult] = await Promise.all([
        fetch(`${PAYMENT_URL}/payment/athlete/${athleteId}/payments`, {
          method: 'GET',
          credentials: 'include'
        }),
        fetch(
          `${PAYMENT_URL}/payment/athlete/${athleteId}/enrollment-requests`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )
      ])
      if (!paymentsResult.ok || !enrollmentResult.ok) {
        console.error('Failed to fetch payment or enrollment data:', {
          paymentsStatus: paymentsResult.status,
          enrollmentStatus: enrollmentResult.status
        })
        return
      }
      const [paymentsData, enrollmentData] = await Promise.all([
        paymentsResult.json(),
        enrollmentResult.json()
      ])
      if (paymentsData.error || enrollmentData.error) {
        console.error(
          'Error fetching additional data:',
          paymentsData.error || enrollmentData.error
        )
        return
      }
      setAthleteDetails({
        ...data,
        payments: paymentsData.data ?? [],
        enrollment_requests: enrollmentData.data ?? []
      })

      const firstPayment = paymentsData.data?.[0]
      setAvailableDate(firstPayment?.availableDate || null)
    } catch (error) {
      console.error('Error fetching athlete data:', error)
    } finally {
      setLoading(false)
    }
  }, [user, setAthleteDetails])

  return { isLoading, fetchAthleteData, availableDate, athleteDetails }
}
