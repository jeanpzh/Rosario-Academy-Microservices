import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import supabaseConfig from '@common/supabase/supabase.config'
import jwtConfig from './config/jwt.config'
import { CacheAdapter } from '@common/cache/cache.adapter'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { CacheConfigModule } from '@common/cache/cache.module'
import { SupabaseProvider } from '@common/supabase/supabase.provider'
import { join } from 'path'
import { AuthRepository } from './auth.repository'
import { AuthRepositoryImpl } from './auth.repository.impl'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [supabaseConfig, jwtConfig],
      envFilePath: ['.env.local', '.env']
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '24h' }
      }),
      global: true
    }),
    CacheConfigModule,
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../../apps/common/proto/user.proto'),
          url: process.env.USER_SERVICE_GRPC_URL || 'user-service:50051',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
          }
        }
      }
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    SupabaseProvider,
    {
      provide: CacheBoundarie,
      useClass: CacheAdapter
    },
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl
    }
  ]
})
export class AppModule {}
