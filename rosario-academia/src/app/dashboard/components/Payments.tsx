'use client'
import { PaymentsList } from '@/app/dashboard/components/athletes/PaymentList'
import { useFetchAthletesWithPayments } from '../auxiliar/athlete-control/payments/hooks/use-fetch-athletes-with-payments'

export default function Payments() {
  const { data: athletes, isLoading, isError } = useFetchAthletesWithPayments()
  if (isLoading) return <div>Cargando...</div>
  if (isError || !athletes) return <div>Error al cargar los atletas</div>

  return (
    <div className='container mx-auto p-6'>
      <h1 className='mb-6 text-3xl font-bold'>Registros de Pagos</h1>
      <PaymentsList athletes={athletes} />
    </div>
  )
}
