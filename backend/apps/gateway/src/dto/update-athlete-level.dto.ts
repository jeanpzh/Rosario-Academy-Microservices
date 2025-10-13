import { IsEnum, IsNotEmpty } from 'class-validator'

export enum AthleteLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export class UpdateAthleteLevelDto {
  @IsEnum(AthleteLevel)
  @IsNotEmpty()
  level!: AthleteLevel
}
