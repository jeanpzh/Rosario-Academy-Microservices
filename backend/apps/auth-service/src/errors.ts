import { UnauthorizedException, BadRequestException } from '@nestjs/common'
import { AuthError } from '@supabase/supabase-js'

export const ERROR_CODES: Record<string, string> = {
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  INVALID_CREDENTIALS: 'invalid_credentials'
}

export function throwAuthError(error: AuthError) {
  switch (error.code) {
    case ERROR_CODES.EMAIL_NOT_CONFIRMED:
      throw new EmailNotConfirmedException()
    case ERROR_CODES.INVALID_CREDENTIALS:
      throw new InvalidCredentialsException()
    default:
      console.log('Unhandled auth error:', error)
      throw new BadRequestException('Error de autenticación')
  }
}

export class EmailNotConfirmedException extends UnauthorizedException {
  constructor() {
    super('Email no confirmado. Por favor verifica tu correo.')
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Credenciales inválidas. Por favor verifica tu email y contraseña.')
  }
}
