import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional
} from 'class-validator'

export enum AthleteLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export class UpdateAthleteDto {
  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  paternal_last_name?: string

  @IsString()
  @IsOptional()
  maternal_last_name?: string

  @IsString()
  @IsOptional()
  birth_date?: string

  @IsString()
  @IsOptional()
  dni?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  avatar_url?: string

  @IsEnum(AthleteLevel)
  @IsOptional()
  level?: AthleteLevel

  @IsString()
  @IsOptional()
  height?: string

  @IsString()
  @IsOptional()
  weight?: string
}
