import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // Determinar el código de estado HTTP
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: any = 'Error interno del servidor'
    let errorCode: string | undefined

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any
        message = resp.message || message
        errorCode = resp.errorCode
      }
    } else if (typeof exception === 'object' && exception !== null) {
      const error = exception as any

      if (error.statusCode && error.message) {
        status = error.statusCode
        message = error.message
        errorCode = error.errorCode
      } else if (error.message) {
        message = error.message
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errorCode && { errorCode })
    }

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception)
      )
    } else if (status >= 400) {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status}: ${JSON.stringify(message)}`
      )
    }

    // Enviar respuesta
    response.status(status).json(errorResponse)
  }
}
