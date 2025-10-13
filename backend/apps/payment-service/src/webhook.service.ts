import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PaymentRepositoryPort, Subscription } from './payment.repository.port'
import MercadoPagoConfig, { Payment } from 'mercadopago'
import {
  KafkaService,
  KafkaTopics,
  PaymentProcessedMessage
} from '../../common/kafka'
import { WebhookPayloadDto, WebhookResponseDto } from './dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class WebhookService {
  private static readonly RENEWAL_THRESHOLD_DAYS = 5
  private static readonly SUBSCRIPTION_DURATION_MONTHS = 1
  private mercadopago: MercadoPagoConfig

  constructor(
    private readonly paymentRepository: PaymentRepositoryPort,
    private readonly configService: ConfigService,
    private readonly kafkaService: KafkaService
  ) {
    this.mercadopago = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN')!
    })
  }

  async handleWebhook(payload: WebhookPayloadDto): Promise<WebhookResponseDto> {
    try {
      Logger.log('Received webhook payload:', payload)
      const existingPayment = await this.paymentRepository.findByPaymentId(
        payload.data.id
      )
      if (existingPayment) {
        return new WebhookResponseDto(
          'Payment already processed, ignoring duplicate webhook',
          HttpStatus.OK
        )
      }

      if (payload.type !== 'payment') {
        return new WebhookResponseDto(
          'Ignoring non-payment webhook',
          HttpStatus.BAD_REQUEST
        )
      }
      Logger.debug('------------------------')
      Logger.debug(
        'Fetching payment from MercadoPago with ID:',
        payload.data.id
      )

      const payment = await new Payment(this.mercadopago).get({
        id: payload.data.id
      })

      Logger.log('Payment retrieved from MercadoPago:', {
        id: payment.id,
        status: payment.status,
        metadata: payment.metadata,
        date_created: payment.date_created,
        date_approved: payment.date_approved,
        method_id: payment.payment_method_id
      })

      if (payment.status !== 'approved') {
        return new WebhookResponseDto(
          `Payment not approved (status: ${payment.status}), ignoring`,
          HttpStatus.BAD_REQUEST
        )
      }

      // Validar que metadata contenga athlete_id
      if (!payment.metadata?.athlete_id) {
        Logger.error('Payment metadata missing athlete_id:', payment.metadata)
        return new WebhookResponseDto(
          'Payment metadata missing required athlete_id field',
          HttpStatus.BAD_REQUEST
        )
      }
      Logger.debug('payment', JSON.stringify(payment))

      const currentDate = new Date(payment.date_created!)
      Logger.debug(
        'Processing payment with athlete_id:',
        payment.metadata.athlete_id
      )
      const subscription = await this.getOrUpdateSubscription(
        payment.metadata.athlete_id,
        currentDate
      )

      await this.paymentRepository.savePayment({
        payment_id: payload.data.id,
        amount: payment.metadata.amount,
        athlete_id: payment.metadata.athlete_id,
        payment_date: new Date(payment.date_approved!).toISOString(),
        payment_method_id: payment.payment_method_id!,
        transaction_reference: payment.external_reference!,
        subscription_id: subscription.id
      })

      await this.publishPaymentProcessedEvent(
        payment,
        subscription,
        payload.data.id
      )

      return new WebhookResponseDto(
        'Payment processed successfully',
        HttpStatus.OK
      )
    } catch (error) {
      Logger.error('Error processing webhook:', error)
      return new WebhookResponseDto(
        `Error processing webhook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  private async publishPaymentProcessedEvent(
    payment: any,
    subscription: Subscription,
    paymentId: string
  ): Promise<void> {
    const paymentMessage: PaymentProcessedMessage = {
      athlete_id: payment.metadata.athlete_id,
      subscription_id: subscription.id,
      schedule_id: payment.metadata.schedule_id,
      payment_id: paymentId,
      amount: payment.metadata.amount,
      payment_date: new Date(payment.date_approved!).toISOString()
    }

    await this.kafkaService.sendMessage<PaymentProcessedMessage>(
      KafkaTopics.PAYMENT_PROCESSED,
      paymentMessage,
      payment.metadata.athlete_id
    )
  }

  private async getOrUpdateSubscription(
    athleteId: string,
    currentDate: Date
  ): Promise<Subscription> {
    const activeSub =
      await this.paymentRepository.findActiveSubscription(athleteId)

    if (!activeSub) {
      return await this.createNewSubscription(athleteId, currentDate)
    }

    const daysRemaining = this.calculateDaysRemaining(
      activeSub.end_date,
      currentDate
    )

    if (daysRemaining <= WebhookService.RENEWAL_THRESHOLD_DAYS) {
      await this.extendSubscription(activeSub, currentDate)
    }

    return activeSub
  }

  private calculateDaysRemaining(endDate: string, currentDate: Date): number {
    const end = new Date(endDate)
    return (end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  }

  private async extendSubscription(
    subscription: Subscription,
    currentDate: Date
  ): Promise<void> {
    const currentEndDate = new Date(subscription.end_date)
    const newEndDate = new Date(currentEndDate)
    newEndDate.setMonth(
      newEndDate.getMonth() + WebhookService.SUBSCRIPTION_DURATION_MONTHS
    )

    await this.paymentRepository.updateSubscriptionEndDate(
      subscription.id,
      newEndDate.toISOString().split('T')[0]
    )

    subscription.end_date = newEndDate.toISOString().split('T')[0]
  }

  private async createNewSubscription(
    athleteId: string,
    currentDate: Date
  ): Promise<Subscription> {
    const startDate = currentDate.toISOString().split('T')[0]
    const endDate = new Date(currentDate)
    endDate.setMonth(
      endDate.getMonth() + WebhookService.SUBSCRIPTION_DURATION_MONTHS
    )

    return await this.paymentRepository.createSubscription({
      athlete_id: athleteId,
      start_date: startDate,
      end_date: endDate.toISOString().split('T')[0],
      status: 'active'
    })
  }
}
