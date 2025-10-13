import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter as NestRpcExceptionFilter
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'

export interface IRpcException {
  statusCode: number
  message: string
  errorCode?: string
  metadata?: Record<string, any>
}

@Catch(RpcException)
export class RpcExceptionFilter
  implements NestRpcExceptionFilter<RpcException>
{
  private readonly logger = new Logger(RpcExceptionFilter.name)

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError() as any

    const rpcError: IRpcException = {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error interno del microservicio',
      errorCode: error.errorCode,
      metadata: error.metadata
    }

    // Logging
    this.logger.error(
      `[Microservice] ${rpcError.statusCode} - ${rpcError.message}`,
      error.stack || JSON.stringify(error)
    )

    return throwError(() => rpcError)
  }
}

export function createRpcException(
  statusCode: number,
  message: string,
  errorCode?: string,
  metadata?: Record<string, any>
): RpcException {
  return new RpcException({
    statusCode,
    message,
    errorCode,
    metadata
  })
}
