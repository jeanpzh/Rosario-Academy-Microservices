import { Expose } from 'class-transformer'

@Expose()
export class ScheduleItemResponse {
  schedule_name: string
  start_time: string
  end_time: string
  weekday: string
}

@Expose()
export class ScheduleResponse {
  schedules: ScheduleItemResponse[]
}
