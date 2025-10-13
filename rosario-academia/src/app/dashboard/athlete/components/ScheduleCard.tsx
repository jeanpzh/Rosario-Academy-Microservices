import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetchSchedule } from '../hooks/use-fetch-schedule'
import { useUser } from '@/contexts/user-context'
import CardSkeleton from '../../components/CardSkeleton'
export function ScheduleCard() {
  const { userId } = useUser()

  const { data: schedules, isLoading } = useFetchSchedule({ athleteId: userId })

  if (isLoading) return <CardSkeleton className='md:col-span-2 lg:col-span-1' />

  return (
    <Card className='md:col-span-2 lg:col-span-1'>
      <CardHeader>
        <CardTitle>Mi Horario</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {schedules?.map((schedule: any, index: number) => (
            <li key={index}>
              <p className='text-sm text-muted-foreground'>
                {schedule.weekday} de {schedule.start_time} a{' '}
                {schedule.end_time}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
