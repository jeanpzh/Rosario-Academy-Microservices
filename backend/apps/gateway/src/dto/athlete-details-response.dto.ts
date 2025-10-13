import { Expose } from 'class-transformer'

@Expose()
export class AthleteDetailsResponse {
  height?: number

  weight?: number

  level: string
}
