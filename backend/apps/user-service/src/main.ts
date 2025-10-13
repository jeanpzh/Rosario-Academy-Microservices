import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './users.module'
import { Logger } from '@nestjs/common'
import { join } from 'path'

async function bootstrap() {
  const logger = new Logger('UserService')
  const grpcPort = process.env.USER_SERVICE_GRPC_PORT || '50051'
  const TCPPort = process.env.USER_SERVICE_TCP_PORT || '8005'

  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: Number(TCPPort) }
  })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../../../apps/common/proto/user.proto'),
      url: `0.0.0.0:${grpcPort}`
    }
  })

  await app.startAllMicroservices()
  await app.listen(0)
  logger.log(`User Service (gRPC) is running on port ${grpcPort}`)
  logger.log(`User Service (TCP) is running on port ${TCPPort}`)
}

bootstrap()
