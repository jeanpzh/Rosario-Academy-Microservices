import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PaymentService } from './payment.service'
import { Request } from 'express'

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('create_subscription')
  async createPaymentPreference(
    @Payload() body: { athleteId: string; scheduleId: string; email: string }
  ) {
    return this.paymentService.createPaymentPreference(body)
  }

  @MessagePattern('mercadopago_webhook')
  async mercadoPagoWebhook(@Payload() req: Request) {
    return this.paymentService.handleWebhook(req)
  }

  @MessagePattern('get_athlete_payments')
  async getAthletePayments(@Payload() athleteId: string) {
    return this.paymentService.getAthletePaymentsWithResponse(athleteId)
  }

  @MessagePattern('get_athlete_enrollment_requests')
  async getAthleteEnrollmentRequests(@Payload() athleteId: string) {
    return this.paymentService.getAthleteEnrollmentRequestsWithResponse(
      athleteId
    )
  }

  @MessagePattern('get_athlete_subscription')
  async getAthleteSubscription(@Payload() athleteId: string) {
    return this.paymentService.getAthleteSubscriptionWithResponse(athleteId)
  }

  @MessagePattern('get_all_payment_data')
  async getAllPaymentData(@Payload() athleteId: string) {
    return this.paymentService.getAllPaymentDataWithResponse(athleteId)
  }

  @MessagePattern('get_payment_methods')
  async getPaymentMethods() {
    return this.paymentService.getPaymentMethodsWithResponse()
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
  ) {
    return this.paymentService.createPaymentRecordWithResponse(
      data.athleteId,
      data.paymentData
    )
  }

  @MessagePattern('get_athletes_with_payments')
  async getAthletesWithPayments() {
    return this.paymentService.getAthletesWithPaymentsWithResponse()
  }
}
