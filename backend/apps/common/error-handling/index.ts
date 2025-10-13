export abstract class AppException extends Error {
  protected constructor(
    public readonly message: string,
    public readonly errorCode: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ResourceNotFoundException extends AppException {
  constructor(resource: string, identifier: string | number) {
    super(
      `${resource} con identificador '${identifier}' no fue encontrado.`,
      'RESOURCE_NOT_FOUND',
      { resource, identifier }
    )
  }
}
export class ValidationException extends AppException {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', metadata)
  }
}
export class UnauthorizedException extends AppException {
  constructor(
    message: string = 'No autorizado',
    metadata?: Record<string, any>
  ) {
    super(message, 'UNAUTHORIZED', metadata)
  }
}
