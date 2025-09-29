import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserController } from '../users/user.controller'
import { UserService } from './user.service'
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' }
      }),
      global: true
    }),
    ConfigModule,
    CacheModule.register<CacheModuleOptions>({
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: process.env.REDIS_HOST ?? "localhost", port: process.env.REDIS_PORT ?? 6379 }
        })
      })
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class AppModule {}
