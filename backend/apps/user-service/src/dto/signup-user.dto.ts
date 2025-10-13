import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  Length,
  Matches
} from 'class-validator'

export class SignupUserDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @Matches(/^[0-9]{8}$/)
  dni: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  paternalLastName: string

  @IsString()
  @IsNotEmpty()
  maternalLastName: string

  @IsString()
  @IsNotEmpty()
  @Length(9, 15)
  phone: string

  @IsString()
  @IsNotEmpty()
  role: string

  @IsDateString()
  birthdate: string

  @IsString()
  avatar?: string
  
  metadata: { [key: string]: any } | undefined;
}
