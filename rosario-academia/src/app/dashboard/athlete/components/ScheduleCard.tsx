import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAthleteStore } from '@/lib/stores/useUserStore'

export function ScheduleCard({ className }: { className?: string }) {
  const athlete = useAthleteStore((state) => state.athleteDetails)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Mi Horario</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {athlete?.enrollment_requests.map((request: any, index: number) => (
            <li key={index}>
              <p className='text-sm text-muted-foreground'>
                {request.requested_schedule.weekday} de{' '}
                {request.requested_schedule.start_time} a{' '}
                {request.requested_schedule.end_time}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
