import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import MercadoPagoConfig from 'mercadopago'
import { KafkaModule } from '../../common/kafka'
import { PaymentRepositoryPort } from './payment.repository.port'
import { PaymentRepository } from './repository/payment.repository.impl'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { CacheAdapter } from '@common/cache/cache.adapter'
import { CacheConfigModule } from '@common/cache/cache.module'
import { WebhookService } from './webhook.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    }),
    KafkaModule.forRootAsync(),
    CacheConfigModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    WebhookService,

    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService): SupabaseClient => {
        return createClient(
          configService.get<string>('SUPABASE_URL')!,
          configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
        )
      },
      inject: [ConfigService]
    },
    {
      provide: SupabaseClient,
      useFactory: (supabaseClient: SupabaseClient) => supabaseClient,
      inject: ['SUPABASE_CLIENT']
    },
    {
      provide: 'MERCADOPAGO_CONFIG',
      useFactory: (configService: ConfigService): MercadoPagoConfig => {
        return new MercadoPagoConfig({
          accessToken: configService.get<string>('MP_ACCESS_TOKEN')!
        })
      },
      inject: [ConfigService]
    },
    {
      provide: MercadoPagoConfig,
      useFactory: (mercadopago: MercadoPagoConfig) => mercadopago,
      inject: ['MERCADOPAGO_CONFIG']
    },
    {
      provide: PaymentRepositoryPort,
      useClass: PaymentRepository
    },
    {
      provide: CacheBoundarie,
      useClass: CacheAdapter
    }
  ]
})
export class PaymentModule {}
