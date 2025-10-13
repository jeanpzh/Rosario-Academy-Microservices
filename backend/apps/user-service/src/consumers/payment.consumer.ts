import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Inject
} from '@nestjs/common'
import { Consumer, EachMessagePayload } from 'kafkajs'
import { KafkaTopics, PaymentProcessedMessage } from '@common/kafka'
import { AthleteRepository } from '../athletes/athlete.boundarie'

@Injectable()
export class PaymentConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentConsumerService.name)

  constructor(
    @Inject('KAFKA_CONSUMER')
    private readonly consumer: Consumer,
    private readonly athleteRepository: AthleteRepository
  ) {}

  async onModuleInit() {
    try {
      await this.consumer.subscribe({
        topics: [KafkaTopics.PAYMENT_PROCESSED],
        fromBeginning: false
      })

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload)
        }
      })

      this.logger.log(
        `Kafka consumer subscribed to topic: ${KafkaTopics.PAYMENT_PROCESSED}`
      )
    } catch (error) {
      this.logger.error('Error initializing Kafka consumer:', error)
    }
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect()
      this.logger.log('Kafka consumer disconnected')
    } catch (error) {
      this.logger.error('Error disconnecting Kafka consumer:', error)
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload

    this.logger.log(
      `Processing message from topic ${topic}[${partition}] offset ${message.offset}`
    )

    try {
      const paymentData = this.parseMessage<PaymentProcessedMessage>(message)

      if (!paymentData) {
        this.logger.error('Failed to parse payment message')
        return
      }

      this.logger.log(
        `Payment processed for athlete ${paymentData.athlete_id}: $${paymentData.amount}`
      )

      await this.athleteRepository.updateEnrollment(
        paymentData.athlete_id,
        paymentData.subscription_id
      )

      await this.athleteRepository.decrementSpot(paymentData.schedule_id)

      this.logger.log(
        `Successfully updated subscription for athlete ${paymentData.athlete_id}`
      )
    } catch (error) {
      this.logger.error(
        `Error processing payment message: ${error.message}`,
        error.stack
      )
    }
  }

  private parseMessage<T>(message: EachMessagePayload['message']): T | null {
    try {
      if (!message.value) return null
      return JSON.parse(message.value.toString()) as T
    } catch (error) {
      this.logger.error('Error parsing message:', error)
      return null
    }
  }
}
