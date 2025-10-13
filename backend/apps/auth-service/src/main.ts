import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './auth.module'
import { Logger } from '@nestjs/common'
import { RpcExceptionFilter } from '@common/error-handling/microservices/rpc-exception.filter'

async function bootstrap() {
  const logger = new Logger('AuthService')
  const tcpPort = parseInt(process.env.AUTH_SERVICE_PORT || '8002')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { port: tcpPort, host: '0.0.0.0' }
    }
  )
  app.useGlobalFilters(new RpcExceptionFilter())

  await app.listen()
  logger.log(`Auth Service (TCP) is running on port ${tcpPort}`)
  logger.log(`gRPC Client configured for User Service`)
}

bootstrap()
