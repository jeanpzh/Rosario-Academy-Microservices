'use client'

import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { PaymentStatus } from './payment-status'
import { PaymentHistory } from './payment-history'
import { BenefitsSection } from './benefits-section'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LoadingPage from '@/components/LoadingPage'
import { useMemo, useEffect } from 'react'
import { getDaysUntilNextPayment } from '@/utils/formats'
import { useUser } from '@/contexts/user-context'
import { useFetchFullProfile } from '@/components/layout/dashboard/hooks/use-fetch-full-profile'
import { useFetchInitUrl } from '../hooks/use-fetch-init-url'
import { useFetchEnrollmentRequests } from '../hooks/use-fetch-enrollment-requests'
import { useFetchPaymentsById } from '../../hooks/use-fetch-payments-by-id'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export function PaymentDashboard() {
  const { userId } = useUser()
 
  const { data: profile, isLoading } = useFetchFullProfile({ userId })
  const { data: enrollmentRequests, isLoading: isLoadingEnrollment } =
    useFetchEnrollmentRequests({ userId })
  const { data: payments, isLoading: isLoadingPayments } = useFetchPaymentsById(
    { id: userId }
  )
  console.log({
    enrollmentRequests,
    planId: enrollmentRequests?.requested_schedule_id.plan_id!,
    schedule_id: enrollmentRequests?.requested_schedule_id.schedule_id
  })
  const {
    isLoading: isLoadingInit,
    error: initError,
    refetch
  } = useFetchInitUrl({
    userId,
    planId: enrollmentRequests?.requested_schedule_id.plan_id!,
    scheduleId: enrollmentRequests?.requested_schedule_id.schedule_id!
  })
  console.log({ enrollmentRequests })
  async function handleRedirectToPayment() {
    try {
      const result = await refetch()

      if (result.data?.init_point) {
        window.location.href = result.data.init_point
      } else {
        console.error('No init_point found in response:', result.data)
        toast.error('No se pudo obtener la URL de pago')
      }
    } catch (error) {
      toast.error('Error al procesar el pago')
      console.error('Payment error:', error)
    }
  }

  const daysUntilNextPayment = useMemo(() => {
    return getDaysUntilNextPayment(payments?.[0]?.end_date!)
  }, [payments])

  const lastPayment = payments?.[0]

  if (isLoadingInit || isLoading || isLoadingEnrollment || isLoadingPayments)
    return <LoadingPage />

  if (initError)
    return <div>Ocurrió un error inesperado {initError.message}</div>
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-gray-50 text-gray-900 dark:bg-[#181818] dark:text-gray-100'
    >
      <header className='bg-white shadow dark:bg-[#222222]'>
        <div className='container mx-auto px-4 py-6'>
          <h1 className='text-2xl font-semibold'>Pagos y Suscripción</h1>
        </div>
      </header>
      <main className='container mx-auto space-y-8 p-4'>
        <PaymentStatus
          isPaid={
            enrollmentRequests?.status === 'approved' ||
            (payments !== undefined && payments.length > 0)
          }
          onPayNow={handleRedirectToPayment}
          last_payment_date={
            lastPayment?.payment_date
              ? new Date(lastPayment?.payment_date).toLocaleDateString()
              : 'N/A'
          }
          payment_amount={lastPayment?.amount!}
          daysUntilNextPayment={daysUntilNextPayment}
          disabled={!profile?.avatarUrl}
        />
        {!profile?.avatarUrl && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20'
          >
            <p className='text-yellow-800 dark:text-yellow-200'>
              Debes completar tu perfil para poder realizar el pago.
              Específicamente, subir una foto.
            </p>
            <Link href='/dashboard/athlete/profile'>
              <Button
                variant='link'
                className='mt-2 p-0 text-yellow-600 dark:text-yellow-400'
              >
                Completar perfil
              </Button>
            </Link>
          </motion.div>
        )}
        <div className='grid gap-8 md:grid-cols-2'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaymentHistory
              payments={
                payments?.map((payment: any, index: number) => ({
                  id: index,
                  date: new Date(payment.payment_date).toLocaleDateString(),
                  amount: payment.amount,
                  method: 'Yape',
                  status: 'Pagado'
                })) || []
              }
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BenefitsSection />
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
}
