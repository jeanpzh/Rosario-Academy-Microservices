import { Module, DynamicModule, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Kafka, Producer } from 'kafkajs'
import { KafkaService } from './kafka.service'

export interface KafkaModuleOptions {
  clientId: string
  brokers: string[]
  groupId?: string
}

@Global()
@Module({})
export class KafkaModule {
  static forRootAsync(): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: 'KAFKA_CLIENT',
          useFactory: (configService: ConfigService): Kafka => {
            const brokers = configService
              .get<string>('KAFKA_BROKERS')
              ?.split(',') || ['localhost:9092']
            const clientId =
              configService.get<string>('KAFKA_CLIENT_ID') || 'payment-service'

            return new Kafka({
              clientId,
              brokers
            })
          },
          inject: [ConfigService]
        },
        {
          provide: 'KAFKA_PRODUCER',
          useFactory: async (kafka: Kafka): Promise<Producer> => {
            const producer = kafka.producer()
            await producer.connect()
            return producer
          },
          inject: ['KAFKA_CLIENT']
        },
        KafkaService
      ],
      exports: ['KAFKA_PRODUCER', 'KAFKA_CLIENT', KafkaService]
    }
  }

  static forRoot(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: 'KAFKA_CLIENT',
          useValue: new Kafka({
            clientId: options.clientId,
            brokers: options.brokers
          })
        },
        {
          provide: 'KAFKA_PRODUCER',
          useFactory: async (kafka: Kafka): Promise<Producer> => {
            const producer = kafka.producer()
            await producer.connect()
            return producer
          },
          inject: ['KAFKA_CLIENT']
        },
        KafkaService
      ],
      exports: ['KAFKA_PRODUCER', 'KAFKA_CLIENT', KafkaService]
    }
  }
}
