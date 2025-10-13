import { NestFactory } from '@nestjs/core'
import { PaymentModule } from './payment.module'
import { MicroserviceOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface'
import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common'
async function bootstrap() {
  const port = parseInt(process.env.PAYMENT_SERVICE_PORT || '3001')
  const logger = new Logger()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.PAYMENT_SERVICE_HOST || '0.0.0.0',
        port: port
      },
      logger: ['error', 'warn', 'log']
    }
  )

  await app.listen()
  logger.log(`Payment Service is running on port ${port}`)
}

bootstrap()
