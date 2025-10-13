import { NestFactory, Reflector } from '@nestjs/core'
import { GatewayModule } from './gateway.module'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { Logger } from '@nestjs/common/services/logger.service'
import { HttpExceptionFilter } from './errors/http-exception.filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(GatewayModule)

  // Middlewares
  app.use(cookieParser())

  // CORS Configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })

  // Global HTTP Exception Filter para el Gateway
  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false
    })
  )

  // Add global ClassSerializerInterceptor for response DTO transformation
  /* app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    })
  )  */

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Rosario Academia API')
    .setDescription('API Gateway for Rosario Academia Microservices')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT-auth'
    )
    .addCookieAuth('auth_session', {
      type: 'apiKey',
      in: 'cookie',
      name: 'auth_session'
    })
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Athletes', 'Athlete management endpoints')
    .addTag('Workers', 'Worker/Assistant management endpoints')
    .addTag('Payment', 'Payment processing endpoints')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Rosario Academia API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  })

  const port = process.env.PORT ?? 3010
  await app.listen(port, () => {
    logger.log(`🚀 Gateway is running on port ${port}`)
    logger.log(
      `📚 Swagger documentation available at http://localhost:${port}/api/docs`
    )
    logger.log(
      `📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`
    )
  })
}
bootstrap()
