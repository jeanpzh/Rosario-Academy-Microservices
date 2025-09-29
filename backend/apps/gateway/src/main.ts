import { NestFactory } from '@nestjs/core'
import { GatewayModule } from './gateway.module'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { Logger } from '@nestjs/common/services/logger.service'
async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(GatewayModule)
  app.use(cookieParser())
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  await app.listen(process.env.PORT ?? 3010, () => {
    logger.log(`Gateway is running on port HOLAAA${process.env.PORT ?? 3010}`)
  })
}
bootstrap()
