import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
async function bootstrap() {
  const port = parseInt(process.env.USER_SERVICE_PORT || '3005')

  const logger = new Logger()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || 'localhost',
        port: port
      }
    }
  )

  await app.listen()
  logger.log(`User Service is running on port ${port}`)
}
bootstrap()
