import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { CacheConfigModule } from '@common/cache/cache.module'
import { UserController } from './users/user.controller'
import { UserGrpcController } from './users/user.grpc.controller'

import { UserRepositoryImpl } from './users/user.repository'
import { CacheAdapter } from '@common/cache/cache.adapter'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import supabaseConfig from '@common/supabase/supabase.config'
import { SupabaseProvider } from '@common/supabase/supabase.provider'
import { UserRepository } from './users/user.port'
import { UserRegisterStrategy } from './strategy/user.register.strategy'
import { UserStrategy } from './strategy/user.strategy.port'
import { AthleteRegisterStrategy } from './strategy/athlete.register.strategy'
import { AssistantRegisterStrategy } from './strategy/assistant.register.strategy'
import { AdminRegisterStrategy } from './strategy/admin.register.strategy'
import { AthleteRepository } from './athletes/athlete.boundarie'
import { AthleteRepositoryImpl } from './athletes/athlete.repository'
import { AthleteController } from './athletes/athlete.controller'
import { AthleteCases } from './athletes/athlete.cases'
import { Kafka, Consumer } from 'kafkajs'
import { PaymentConsumerService } from './consumers/payment.consumer'
import { WorkerController } from './worker/worker.controller'
import { WorkerService } from './worker/worker.service'
import { WorkerRepository } from './worker/worker.repository'
import { WorkerRepositoryImpl } from './worker/worker.repository.impl'
import { SupabaseClient } from '@supabase/supabase-js'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [supabaseConfig],
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
    CacheConfigModule
  ],
  controllers: [
    UserController,
    UserGrpcController,
    AthleteController,
    WorkerController
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    {
      provide: CacheBoundarie,
      useClass: CacheAdapter
    },
    {
      provide: UserStrategy,
      useClass: UserRegisterStrategy
    },
    {
      provide: AthleteRepository,
      useClass: AthleteRepositoryImpl
    },
    {
      provide: 'KAFKA_CONSUMER',
      useFactory: async (configService: ConfigService): Promise<Consumer> => {
        const brokers = configService
          .get<string>('KAFKA_BROKERS')
          ?.split(',') || ['localhost:9092']

        // Usar un clientId único para el user-service
        const clientId = 'user-service'

        const kafka = new Kafka({
          clientId,
          brokers
        })

        const consumer = kafka.consumer({ groupId: 'user-service-group' })
        await consumer.connect()
        return consumer
      },
      inject: [ConfigService]
    },
    {
      provide: WorkerRepository,
      useClass: WorkerRepositoryImpl
    },
    {
      provide: SupabaseClient,
      useFactory: (supabaseClient: SupabaseClient) => supabaseClient,
      inject: ['SUPABASE_CLIENT']
    },
    AthleteCases,
    AthleteRegisterStrategy,
    AssistantRegisterStrategy,
    AdminRegisterStrategy,
    UserRegisterStrategy,
    PaymentConsumerService,
    Logger,
    SupabaseProvider,
    WorkerService
  ],
  exports: []
})
export class AppModule {}
