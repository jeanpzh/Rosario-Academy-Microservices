import { IsString, IsEmail, IsOptional } from 'class-validator'

export class UpdateAssistantDto {
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
}
