import { IsEnum, IsNotEmpty } from 'class-validator'

export enum AthleteStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

export class UpdateAthleteStatusDto {
  @IsEnum(AthleteStatus)
  @IsNotEmpty()
  status!: AthleteStatus
}
