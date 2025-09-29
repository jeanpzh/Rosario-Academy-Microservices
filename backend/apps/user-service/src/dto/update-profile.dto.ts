import { IsString, IsNotEmpty, MinLength } from 'class-validator'

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido!' })
  firstName: string

  @IsString()
  @IsNotEmpty({ message: 'Apellido paterno requerido' })
  paternalLastName: string

  @IsString()
  @IsNotEmpty({ message: 'Apellido materno requerido' })
  maternalLastName: string

  @IsString()
  @MinLength(9, { message: 'El teléfono debe tener al menos 9 caracteres' })
  phone: string
}

export interface ActionResponse {
  status: number
  message: string
  data?: any
}
