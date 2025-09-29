import { Controller, Get, Post, Body, Param, Req, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy
  ) {}

  @Post('create-subscription')
  async createPaymentPreference(
    @Body() body: { athleteId: string; scheduleId: string; email: string }
  ) {
    return await firstValueFrom(
      this.paymentClient.send('create_subscription', body)
    )
  }

  // Webhook MercadoPago
  @Post('webhook')
  async mercadoPagoWebhook(@Req() req: Request) {
    return await firstValueFrom(
      this.paymentClient.send('mercadopago_webhook', req)
    )
  }

  // Obtener pagos de un atleta
  @Get('athlete/:id/payments')
  async getAthletePayments(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_athlete_payments', athleteId)
    )
  }

  // Obtener solicitudes de inscripción de un atleta
  @Get('athlete/:id/enrollment-requests')
  async getAthleteEnrollmentRequests(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_athlete_enrollment_requests', athleteId)
    )
  }

  // Obtener suscripción activa de un atleta
  @Get('athlete/:id/subscription')
  async getAthleteSubscription(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_athlete_subscription', athleteId)
    )
  }

  // Obtener todos los datos de pago de un atleta
  @Get('athlete/:id/all-data')
  async getAllPaymentData(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_all_payment_data', athleteId)
    )
  }

  // Obtener métodos de pago disponibles
  @Get('methods')
  async getPaymentMethods() {
    return await firstValueFrom(
      this.paymentClient.send('get_payment_methods', {})
    )
  }

  // Crear un registro de pago
  @Post('athlete/:id/create')
  async createPaymentRecord(
    @Param('id') athleteId: string,
    @Body()
    paymentData: {
      amount: number
      payment_method_id: string
      transaction_reference: string
      payment_date: string
      subscription_start_date: string
      subscription_end_date: string
    }
  ) {
    return await firstValueFrom(
      this.paymentClient.send('create_payment_record', {
        athleteId,
        paymentData
      })
    )
  }

  // Obtener atletas con sus pagos (para admin/auxiliar)
  @Get('athletes-with-payments')
  async getAthletesWithPayments() {
    return await firstValueFrom(
      this.paymentClient.send('get_athletes_with_payments', {})
    )
  }
}
