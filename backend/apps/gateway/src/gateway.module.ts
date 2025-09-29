import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth/auth.controller'
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'

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
          host: 'payment-service',
          port: 8001
        }
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth-service',
          port: 8002
        }
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: 8005
        }
      },
      {
        name: 'ATHLETE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'athlete-service',
          port: 8003
        }
      },
      {
        name: 'WORKER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'worker-service',
          port: 8004
        }
      }
    ]),
    CacheModule.registerAsync<CacheModuleAsyncOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST') ?? 'localhost',
            port: configService.get('REDIS_PORT') ?? 6379,
            ttl: configService.get('REDIS_TTL') ?? 600
          }
        })
      })
    }),
    exports: [CacheModule]
  ],
  controllers: [AuthController]
})
export class GatewayModule {}
