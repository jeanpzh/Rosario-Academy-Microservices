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

export class CreateAthleteDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string

  @IsString()
  @IsNotEmpty()
  paternal_last_name!: string

  @IsString()
  @IsNotEmpty()
  maternal_last_name!: string

  @IsString()
  @IsNotEmpty()
  birth_date!: string

  @IsString()
  @IsNotEmpty()
  dni!: string

  @IsString()
  @IsNotEmpty()
  phone!: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  avatar_url?: string

  @IsEnum(AthleteLevel)
  @IsNotEmpty()
  level!: AthleteLevel

  @IsString()
  @IsOptional()
  height?: string

  @IsString()
  @IsOptional()
  weight?: string
}
