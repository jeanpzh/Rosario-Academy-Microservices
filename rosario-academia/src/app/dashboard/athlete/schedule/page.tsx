'use client'

import { useAthleteStore } from '@/lib/stores/useUserStore'
import WeeklySchedule from '@/app/dashboard/athlete/schedule/components/WeeklySchedule'
import { useEffect, useState } from 'react'
import LoadingPage from '@/components/LoadingPage'

export default function SchedulePage() {
  const [loading, setLoading] = useState(true)
  const [scheduleItems, setScheduleItems] = useState([])
  const athlete = useAthleteStore((state) => state.athleteDetails)

  // Retornamos el LoadingPage si la página se encuentra cargando

  const formatData = (ath: any) => {
    return ath.enrollment_requests.map((request: any) => ({
      weekday: request.requested_schedule.weekday,
      start_time: request.requested_schedule.start_time,
      end_time: request.requested_schedule.end_time,
      schedule_name: request.requested_schedule.schedule_name
    }))
  }

  useEffect(() => {
    try {
      if (athlete) {
        const scheduleItemsa = formatData(athlete)
        setScheduleItems(scheduleItemsa)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching schedule data')
    }
  }, [athlete])

  if (loading) return <LoadingPage />
  return (
    <main className='min-h-screen dark:bg-[#181818]'>
      <WeeklySchedule scheduleItems={scheduleItems} />
    </main>
  )
}
