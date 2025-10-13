'use client'
import { AthleteHeader } from '@/app/dashboard/components/athletes/AthleteHeader'
import { PaymentHistory } from '@/app/dashboard/components/athletes/PaymentHistory'
import { useFetchPaymentsById } from '@/app/dashboard/athlete/hooks/use-fetch-payments-by-id'
import LoadingPage from '@/components/LoadingPage'
import { useParams } from 'next/navigation'
import { useFetchFullProfile } from '@/components/layout/dashboard/hooks/use-fetch-full-profile'

export default function PaymentsById() {
  const { id } = useParams() as { id: string }
  console.log(id)
  const { data: athlete, isLoading: isLoadingAthlete } = useFetchFullProfile({
    userId: id
  })
  console.log({ athlete })
  const { data: payments, isLoading: isLoadingPayments } = useFetchPaymentsById(
    { id: id }
  )
  if (isLoadingAthlete || isLoadingPayments) return <LoadingPage />
  if (!athlete) return <div>Athlete not found</div>
  return (
    <div className='container mx-auto space-y-6 p-6'>
      <AthleteHeader athlete={athlete} />
      <PaymentHistory payments={payments || []} />
    </div>
  )
}
