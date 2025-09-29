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
