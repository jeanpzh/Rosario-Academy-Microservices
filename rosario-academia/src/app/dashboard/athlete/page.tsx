'use client'
import { ProfileCard } from '@/app/dashboard/athlete/components/ProfileCard'
import { ScheduleCard } from '@/app/dashboard/athlete/components/ScheduleCard'
import { ProgressCard } from '@/app/dashboard/athlete/components/ProgressCard'
import { AnnouncementsCard } from '@/app/dashboard/athlete/components/AnnouncementsCard'
import { UpcomingEventsCard } from '@/app/dashboard/athlete/components/UpComingEvents'

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-background p-4 dark:bg-[#181818] md:p-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-2xl font-bold md:text-3xl'>
          Portal del Deportista
        </h1>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
        <ProfileCard />
        <ScheduleCard />
        <ProgressCard />
        <AnnouncementsCard />
        <UpcomingEventsCard />
      </div>
    </div>
  )
}
