import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { AppModule } from './auth.module'
import { Logger } from '@nestjs/common'
async function bootstrap() {
  const port = parseInt(process.env.AUTH_SERVICE_PORT || '3002')
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
      port: port
    }
  })
  await app.listen()
  const logger = new Logger()
  logger.log(`Auth Service is running on port ${port}`)
}

bootstrap()
