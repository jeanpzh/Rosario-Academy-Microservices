import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { JwtModule } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { AuthController } from './auth/gateway.auth.controller'
import { CacheConfigModule } from '@common/cache/cache.module'
import { UsersController } from './user/gateway.user.controller'
import { PaymentController } from './payment/gateway.payment.controller'
import { CookieService } from './auth/gateway.cookie.service'
import { AuthService } from './auth/gateway.auth.service'
import { GatewaySessionService } from './auth/gateway.session.service'
import { CacheAdapter } from '@common/cache/cache.adapter'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { AthletesController } from './user/gateway.athlete.controller'
import { CloudinaryService } from './services/cloudinary.service'
import { WorkerController } from './user/gateway.worker.controller'
import { RolesGuard } from './auth/guards/roles.guard'

import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' }
    }),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PAYMENT_SERVICE_HOST || 'payment-service',
          port: parseInt(process.env.PAYMENT_SERVICE_PORT || '8001')
        }
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'auth-service',
          port: parseInt(process.env.AUTH_SERVICE_PORT || '8002')
        }
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'user-service',
          port: parseInt(process.env.USER_SERVICE_PORT || '8005')
        }
      },
      {
        name: 'ATHLETE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ATHLETE_SERVICE_HOST || 'athlete-service',
          port: parseInt(process.env.ATHLETE_SERVICE_PORT || '8003')
        }
      },
      {
        name: 'WORKER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.WORKER_SERVICE_HOST || 'worker-service',
          port: parseInt(process.env.WORKER_SERVICE_PORT || '8004')
        }
      }
    ]),
    CacheConfigModule
  ],
  controllers: [
    AuthController,
    UsersController,
    PaymentController,
    AthletesController,
    WorkerController,
    HealthController
  ],
  providers: [
    CookieService,
    AuthService,
    GatewaySessionService,
    CloudinaryService,
    Reflector,
    RolesGuard,
    {
      provide: CacheBoundarie,
      useClass: CacheAdapter
    },
    {
      provide: Logger,
      useClass: Logger
    },
  ]
})
export class GatewayModule {}
