'use client'

import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { PaymentStatus } from './payment-status'
import { PaymentHistory } from './payment-history'
import { BenefitsSection } from './benefits-section'
import { submit } from '@/app/dashboard/athlete/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LoadingPage from '@/components/LoadingPage'
import { useMemo, useCallback } from 'react'
import { usePaymentData } from '@/hooks/use-payment-data'
import { getDaysUntilNextPayment } from '@/utils/formats'
import { useAthlete } from '../../provider'
import { getPreferenceInitPoint } from '@/utils/auth/api'
import { useAthleteStore } from '@/lib/stores/useUserStore'

export function PaymentDashboard() {
  const athleteDetails = useAthleteStore((state) => state.athleteDetails)
  const { data, isLoading, error } = usePaymentData(athleteDetails?.athlete_id)

  // Calculate the days until the next payment
  const daysUntilNextPayment = useMemo(() => {
    return getDaysUntilNextPayment(data)
  }, [data])

  // Handle the buy button click, redirecting
  const handleBuy = useCallback(async () => {
    const [firstProfile] = data?.profile || []
    if (firstProfile?.avatar_url === null) {
      toast.error('Debes completar tu perfil antes de realizar el pago.')
      return
    }
    try {
      const enrollmentRequestId = data?.enrollmentRequests[0].request_id

      const { data: url } = await getPreferenceInitPoint(
        athleteDetails?.athlete_id as string,
        enrollmentRequestId,
        athleteDetails?.email as string
      )
      if (!url) {
        toast.error(
          'Hubo un error al procesar el pago. Por favor, intenta de nuevo.'
        )
        return
      }
      toast.success(
        'Pago procesado correctamente. Redirigiendo a MercadoPago...'
      )
      window.location.href = url
    } catch (err) {
      toast.error(
        'Hubo un error al procesar el pago. Por favor, intenta de nuevo.'
      )
    }
  }, [data])

  if (!athleteDetails?.athlete_id) return <LoadingPage />
  if (isLoading) return <LoadingPage />
  if (error) return <div>Ocurrió un error inesperado</div>

  const { profile, enrollmentRequests: enrollment, payments } = data || {}

  // Extract the first profile and the last payment
  const [firstProfile] = profile || []
  const lastPayment = payments?.[0]

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
          isPaid={enrollment[0]?.status === 'approved'}
          onPayNow={handleBuy}
          payment_method={lastPayment?.payment_method || 'Yape'}
          last_payment_date={
            lastPayment?.payment_date
              ? new Date(lastPayment?.payment_date).toLocaleDateString()
              : 'N/A'
          }
          payment_amount={lastPayment?.amount || 'N/A'}
          daysUntilNextPayment={daysUntilNextPayment}
        />
        {firstProfile?.avatar_url === null && (
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
