'use client'
import { ProfileCard } from '@/app/dashboard/athlete/components/ProfileCard'
import { ScheduleCard } from '@/app/dashboard/athlete/components/ScheduleCard'
import { ProgressCard } from '@/app/dashboard/athlete/components/ProgressCard'
import { PaymentCard } from '@/app/dashboard/athlete/components/PaymentCard'
import { AnnouncementsCard } from '@/app/dashboard/athlete/components/AnnouncementsCard'
import { UpcomingEventsCard } from '@/app/dashboard/athlete/components/UpComingEvents'
import { CarnetCard } from '@/app/dashboard/athlete/components/CarnetCard'
import DashboardSkeleton from '@/app/dashboard/components/DashboardSkeleton'
import { useEffect } from 'react'
import { useAthlete } from './provider'
import { useFetchAthleteData } from '@/hooks/use-fetch-athlete-data'

export default function DashboardPage() {
  const { user } = useAthlete()
  const { isLoading, fetchAthleteData, availableDate } =
    useFetchAthleteData(user)
  useEffect(() => {
    if (user) {
      fetchAthleteData()
    }
  }, [user, fetchAthleteData])

  if (isLoading) return <DashboardSkeleton />
  return (
    <div className='min-h-screen bg-background p-4 dark:bg-[#181818] md:p-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-bold md:text-3xl'>
          Portal del Deportista
        </h1>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
        <ProfileCard className='md:col-span-2' />
        <ScheduleCard className='md:col-span-2 lg:col-span-1' />
        <ProgressCard className='md:col-span-2 lg:col-span-1' />
        {availableDate && <PaymentCard availableDate={availableDate} />}
        {availableDate && <CarnetCard />}
        <AnnouncementsCard className='w-full md:col-span-2' />
        <UpcomingEventsCard className='w-full md:col-span-2 xl:col-span-1' />
      </div>
    </div>
  )
}
