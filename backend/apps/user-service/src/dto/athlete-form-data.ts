// backend/apps/user-service/src/user/dto/athlete-form.dto.ts

import { IsString, IsDateString, IsNotEmpty } from 'class-validator'

export class AthleteFormData {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  paternal_last_name: string

  @IsString()
  @IsNotEmpty()
  maternal_last_name: string

  @IsDateString()
  birth_date: string

  @IsString()
  @IsNotEmpty()
  dni: string

  @IsString()
  @IsNotEmpty()
  level: string

  @IsString()
  @IsNotEmpty()
  phone: string
}
