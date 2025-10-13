import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class UserData {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @Expose()
  email: string

  @ApiProperty({ description: 'User role', example: 'ATHLETE' })
  @Expose()
  role: string
}

@Exclude()
export class AuthSignInResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  @Expose()
  success: boolean

  @ApiProperty({
    description: 'Response message',
    example: 'Inicio de sesión exitoso'
  })
  @Expose()
  message: string

  @ApiProperty({
    description: 'User data',
    type: () => UserData,
    example: {
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        role: 'ATHLETE'
      }
    }
  })
  @Expose()
  @Type(() => UserData)
  data: {
    user: UserData
  }

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  timestamp: string

  constructor(user: any) {
    this.success = true
    this.message = 'Inicio de sesión exitoso'
    this.data = {
      user: {
        id: user.id,
        email: user.email!,
        role: user.role!
      }
    }
    this.timestamp = new Date().toISOString()
  }
}

class SignUpUserData {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string

  @ApiProperty({ description: 'User email', example: 'newuser@example.com' })
  @Expose()
  email: string
}

@Exclude()
export class AuthSignUpResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  @Expose()
  success: boolean

  @ApiProperty({
    description: 'Response message',
    example: 'Usuario registrado exitosamente'
  })
  @Expose()
  message: string

  @ApiProperty({
    description: 'User data',
    type: () => SignUpUserData,
    required: false,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'newuser@example.com'
    }
  })
  @Expose()
  @Type(() => SignUpUserData)
  data?: SignUpUserData

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  timestamp: string

  constructor(success: boolean, message: string, user?: any) {
    this.success = success
    this.message = message
    this.data = user
      ? {
          id: user.id,
          email: user.email
        }
      : undefined
    this.timestamp = new Date().toISOString()
  }
}

@Exclude()
export class AuthSignOutResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  @Expose()
  success: boolean

  @ApiProperty({
    description: 'Response message',
    example: 'Sesión cerrada exitosamente'
  })
  @Expose()
  message: string

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  timestamp: string

  constructor() {
    this.success = true
    this.message = 'Sesión cerrada exitosamente'
    this.timestamp = new Date().toISOString()
  }
}

@Exclude()
export class ChangePasswordResponseDto {
  @ApiProperty({ description: 'Operation success status', example: true })
  @Expose()
  success: boolean

  @ApiProperty({
    description: 'Response message',
    example: 'Contraseña actualizada correctamente'
  })
  @Expose()
  message: string

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  timestamp: string

  constructor(success: boolean, message: string) {
    this.success = success
    this.message = message
    this.timestamp = new Date().toISOString()
  }
}
