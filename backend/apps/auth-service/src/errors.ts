import { HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

export class FieldsRequiredException extends RpcException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.BAD_REQUEST
    })
  }
}

export class DniAlreadyExistsException extends RpcException {
  constructor(dni: string) {
    super({
      message: `El DNI ${dni} ya está registrado.`,
      statusCode: HttpStatus.CONFLICT
    })
  }
}

export class EmailAlreadyExistsException extends RpcException {
  constructor(email: string) {
    super({
      message: `El correo electrónico ${email} ya está registrado.`,
      statusCode: HttpStatus.CONFLICT
    })
  }
}

export class DniNotVerifiedException extends RpcException {
  constructor() {
    super({
      message:
        'Tu DNI aún no ha sido verificado. Por favor, completa la validación para continuar.',
      statusCode: HttpStatus.FORBIDDEN
    })
  }
}

export class UserNotFoundException extends RpcException {
  constructor(identifier: string) {
    super({
      message: `No se encontró un usuario con el identificador: ${identifier}.`,
      statusCode: HttpStatus.NOT_FOUND
    })
  }
}

export class SamePasswordException extends RpcException {
  constructor() {
    super({
      message: 'La nueva contraseña no puede ser igual a la contraseña actual.',
      statusCode: HttpStatus.BAD_REQUEST
    })
  }
}

export class PasswordRecentlyChangedException extends RpcException {
  constructor(daysRemaining: number) {
    super({
      message: `Debes esperar ${daysRemaining} día(s) más para poder cambiar tu contraseña nuevamente.`,
      statusCode: HttpStatus.FORBIDDEN
    })
  }
}
export class RollBackAuthUserException extends RpcException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.BAD_REQUEST
    })
  }
}
export class SignUpException extends RpcException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.BAD_REQUEST
    })
  }
}

export class AuthError extends RpcException {
  constructor(message: string, statusCode?: HttpStatus, name?: string) {
    super({
      message: message,
      statusCode: statusCode,
      name: name
    })
  }
}
export class EmailNotConfirmedException extends RpcException {
  constructor() {
    super({
      message: 'El correo electrónico no está confirmado.',
      statusCode: HttpStatus.FORBIDDEN,
      name: 'authenticateWithCredentials'
    })
  }
}

export class InvalidCredentialsException extends RpcException {
  constructor() {
    super({
      message: 'Credenciales inválidas. Verifica tu email y contraseña.',
      statusCode: HttpStatus.UNAUTHORIZED
    })
  }
}
