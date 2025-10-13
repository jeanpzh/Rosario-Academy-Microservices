'use client'

import WeeklySchedule from '@/app/dashboard/athlete/schedule/components/WeeklySchedule'
import LoadingPage from '@/components/LoadingPage'
import { useFetchSchedule } from '../hooks/use-fetch-schedule'
import { useUser } from '@/contexts/user-context'

export default function SchedulePage() {
  const { userId } = useUser()
  const { isLoading: loading, data: schedule } = useFetchSchedule({
    athleteId: userId
  })

  if (loading) return <LoadingPage />
  return (
    <main className='min-h-screen dark:bg-[#181818]'>
      <WeeklySchedule data={schedule!} />
    </main>
  )
}
