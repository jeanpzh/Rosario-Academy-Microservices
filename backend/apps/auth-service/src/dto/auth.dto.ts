import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
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
