import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

export class CreateAssistantDto {
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
  @IsNotEmpty()
  email!: string
}
