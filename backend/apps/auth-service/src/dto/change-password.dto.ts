import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword: string

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
