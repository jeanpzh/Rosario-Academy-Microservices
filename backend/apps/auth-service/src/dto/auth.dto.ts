import { UserRole } from '@common/enums/user-roles.enum'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum
} from 'class-validator'

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.ATHLETE

  @IsString()
  @IsNotEmpty()
  first_name: string

  @IsString()
  @IsNotEmpty()
  paternal_last_name: string

  @IsString()
  @IsNotEmpty()
  maternal_last_name: string

  @IsString()
  @IsNotEmpty()
  birth_date: string

  @IsString()
  @IsNotEmpty()
  dni: string

  @IsString()
  @IsNotEmpty()
  level: string

  @IsString()
  @IsOptional()
  avatar_url?: string

  @IsString()
  @IsNotEmpty()
  phone: string
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
