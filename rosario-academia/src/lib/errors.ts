export const errorFactory = (name: string) => {
  return class CustomizedError extends Error {
    constructor(message: string) {
      super(message)
      this.name = name
      this.stack = ''
    }
  }
}

export const LoginError = errorFactory('LoginError')
export const DniNotVerifiedError = errorFactory('DniNotVerifiedError')
export const EmailNotConfirmedError = errorFactory('EmailNotConfirmedError')

// Función auxiliar para crear errores específicos de autenticación
export const createAuthError = (message: string): Error => {
  if (message.includes('DNI no verificado')) {
    return new DniNotVerifiedError(message)
  }
  if (message.includes('Email no confirmado')) {
    return new EmailNotConfirmedError(message)
  }
  return new LoginError(message)
}
