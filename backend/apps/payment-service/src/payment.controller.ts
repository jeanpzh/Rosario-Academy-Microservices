import { Controller, Logger } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { WebhookService } from './webhook.service'
import {
  CreatePreferenceDto,
  PreferenceResponseDto,
  WebhookResponseDto
} from './dto'

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly webhookService: WebhookService
  ) {}

  @MessagePattern('create_preference')
  async createPreference(
    @Payload() data: CreatePreferenceDto
  ): Promise<PreferenceResponseDto> {
    Logger.debug('Creating preference with data:', JSON.stringify(data))
    return await this.paymentService.createPreference(data)
  }

  @MessagePattern('mercadopago_webhook')
  async mercadoPagoWebhook(@Payload() data: any): Promise<WebhookResponseDto> {
    Logger.log('Received webhook payload:', data)
    return await this.webhookService.handleWebhook(data)
  }
  @MessagePattern('get_athlete_payments')
  async getAthletePayments(@Payload() athleteId: string) {
    return await this.paymentService.getAthletePayments(athleteId)
  }
  @MessagePattern('get_payment_methods')
  async getPaymentMethods() {
    return await this.paymentService.getPaymentMethods()
  }
  @MessagePattern('create_payment_record')
  async createPaymentRecord(
    @Payload()
    data: {
      athleteId: string
      paymentData: {
        amount: number
        payment_method_id: string
        transaction_reference: string
        payment_date: string
        subscription_start_date: string
        subscription_end_date: string
      }
    }
  ): Promise<{ message: string }> {
    return await this.paymentService.createPaymentRecord(data)
  }
}
