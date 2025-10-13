'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import { HoverBorderGradient } from '@/components/hover-border-gradient'
import { formatDate, getNextFormattedDate } from '@/utils/formats'
import { useHandlePrint } from '@/hooks/use-handle-print'
import LoadingPage from '@/components/LoadingPage'
import AthleteDetails from '@/app/dashboard/athlete/carnet/components/athlete-details'
import AthleteVerification from '@/app/dashboard/athlete/carnet/components/athlete-verification'
import { useFetchPaymentDateQuery } from '@/hooks/use-fetch-payment-date'
import { useGenerateVerificationId } from '@/hooks/use-generate-verification'
import { useFetchPaymentsById } from '../hooks/use-fetch-payments-by-id'
import { useUser } from '@/contexts/user-context'
import { useFetchFullProfile } from '@/components/layout/dashboard/hooks/use-fetch-full-profile'
import { useFetchAthleteData } from '@/hooks/use-fetch-athlete-data'
import { useFetchEnrollmentRequests } from '../payments/hooks/use-fetch-enrollment-requests'
import { useFetchSchedule } from '../hooks/use-fetch-schedule'
import { toast } from 'sonner'

const AthleteCard = () => {
  const { userId } = useUser()
  const {
    data: profile,
    error: profileError,
    isLoading: isLoadingProfile
  } = useFetchFullProfile({ userId: userId! })
  const {
    data: athleteData,
    error: athleteError,
    isLoading: isLoadingAthlete
  } = useFetchAthleteData({ userId: userId! })

  const cardRef = useRef<HTMLDivElement>(null)
  const handlePrint = useHandlePrint(cardRef, 'Carnet de Deportista')

  const {
    data: payments,
    error,
    isLoading
  } = useFetchPaymentsById({ id: userId })

  const availableDate = useMemo(() => {
    if (!payments) return null
    try {
      return getNextFormattedDate(payments[0].end_date as string)
    } catch (err) {
      console.error(err)
      return null
    }
  }, [payments])

  const {
    data: verificationData,
    isLoading: isGeneratingCode,
    error: verificationError
  } = useGenerateVerificationId({
    userId
  })

  const verificationId = verificationData?.verificationId

  const verificationUrl = useMemo(
    () => `https://rosario-academia.vercel.app/verify/${verificationId}`,
    [verificationId]
  )

  const DEFAULT_IMAGE =
    'https://res.cloudinary.com/dcxmhgysh/image/upload/v1737848404/rosario-removebg-preview_yves2v.png'

  if (isLoading || isLoadingAthlete || isLoadingProfile || isGeneratingCode)
    return <LoadingPage />
  if (error || athleteError || profileError || verificationError) {
    console.log(
      'Error loading athlete card data:',
      error || athleteError || profileError || verificationError
    )
    toast.error('Error loading athlete card data')
    return <div>Error loading athlete card data</div>
  }
  return (
    <div className='min-h-screen bg-gray-100 p-4 dark:bg-[#181818] sm:p-8'>
      <h1 className='mb-6 text-center font-sans text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl'>
        Carnet de Deportista
      </h1>

      <div className='mb-8 flex flex-col justify-center gap-4 sm:flex-row'>
        <HoverBorderGradient
          onClick={() => handlePrint()}
          className='w-full sm:w-auto'
        >
          Imprimir Carnet
        </HoverBorderGradient>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className='flex justify-center'
      >
        <Card
          ref={cardRef}
          className='print-card w-full max-w-md overflow-hidden bg-white shadow-lg dark:bg-[#2c2c2c]'
        >
          <div className='flex'>
            <AthleteDetails
              athleteData={{
                ...athleteData,
                ...profile
              }}
              availableDate={availableDate}
              DEFAULT_IMAGE={DEFAULT_IMAGE}
              formatDate={formatDate}
            />
            <AthleteVerification verificationUrl={verificationUrl} />
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AthleteCard
