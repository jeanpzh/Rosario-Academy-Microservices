import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current user password',
    example: 'OldP@ssw0rd',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword: string

  @ApiProperty({
    description: 'New password (must contain uppercase, lowercase and number)',
    example: 'NewP@ssw0rd123',
    minLength: 6,
    maxLength: 20
  })
  @IsString()
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @Length(6, 20, {
    message: 'La nueva contraseña debe tener entre 6 y 20 caracteres'
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
  })
  newPassword: string
}
