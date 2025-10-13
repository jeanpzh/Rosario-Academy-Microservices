import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'User email address to reset password',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string
}

export class ResetPasswordResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  success: boolean

  @ApiProperty({
    description: 'Response message',
    example: 'Email de recuperación enviado'
  })
  message: string

  constructor(success: boolean, message: string) {
    this.success = success
    this.message = message
  }
}
