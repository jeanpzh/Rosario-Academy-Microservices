import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ApiResponseDto<T = any> {
  @Expose()
  success: boolean

  @Expose()
  message: string

  @Expose()
  data?: T

  @Expose()
  statusCode: number

  @Expose()
  timestamp: string

  constructor(
    success: boolean,
    message: string,
    statusCode: number = 200,
    data?: T
  ) {
    this.success = success
    this.message = message
    this.statusCode = statusCode
    this.data = data
    this.timestamp = new Date().toISOString()
  }

  static success<T>(
    message: string,
    data?: T,
    statusCode: number = 200
  ): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, statusCode, data)
  }

  static error(message: string, statusCode: number = 500): ApiResponseDto {
    return new ApiResponseDto(false, message, statusCode)
  }
}

@Exclude()
export class SuccessResponseDto<T = any> extends ApiResponseDto<T> {
  constructor(message: string, data?: T, statusCode: number = 200) {
    super(true, message, statusCode, data)
  }
}

// Respuestas específicas para usuarios
@Exclude()
export class UserResponseDto extends SuccessResponseDto {
  constructor(message: string, user?: any) {
    super(message, user)
  }
}

@Exclude()
export class UserCreatedResponseDto extends UserResponseDto {
  constructor(user: any) {
    super('Usuario creado exitosamente', user)
    this.statusCode = 201
  }
}

@Exclude()
export class UserUpdatedResponseDto extends UserResponseDto {
  constructor(user: any) {
    super('Usuario actualizado exitosamente', user)
  }
}

@Exclude()
export class UserDeletedResponseDto extends SuccessResponseDto {
  constructor() {
    super('Usuario eliminado exitosamente')
    this.statusCode = 204
  }
}
