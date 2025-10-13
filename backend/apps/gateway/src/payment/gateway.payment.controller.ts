import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Inject,
  Logger,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger'
import {
  CreatePaymentRecordDto,
  CreatePreferenceDto
} from 'apps/payment-service/src/dto'
import { firstValueFrom } from 'rxjs'

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy
  ) {}

  @Post('preference')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create payment preference',
    description: 'Create a MercadoPago payment preference'
  })
  @ApiBody({ type: CreatePreferenceDto })
  @ApiResponse({
    status: 201,
    description: 'Preference created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async createPreference(@Body() body: CreatePreferenceDto) {
    Logger.log('Creating preference with body:', JSON.stringify(body))
    return await firstValueFrom(
      this.paymentClient.send('create_preference', body)
    )
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'MercadoPago webhook',
    description: 'Webhook endpoint for MercadoPago notifications'
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully'
  })
  async mercadoPagoWebhook(@Req() req: Request) {
    Logger.log('Received webhook payload:', req.body)
    return await firstValueFrom(
      this.paymentClient.send('mercadopago_webhook', {
        ...req.body
      })
    )
  }

  @Get('athlete/:id')
  @ApiOperation({
    summary: 'Get athlete payments',
    description: 'Get all payments for a specific athlete'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Athlete not found'
  })
  async getAthletePayments(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_athlete_payments', athleteId)
    )
  }

  @Get('athlete/:id/enrollment-requests')
  @ApiOperation({
    summary: 'Get enrollment requests',
    description: 'Get enrollment requests for a specific athlete'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Enrollment requests retrieved successfully'
  })
  async getAthleteEnrollmentRequests(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_athlete_enrollment_requests', athleteId)
    )
  }

  @Get('athlete/:id/subscription')
  @ApiOperation({
    summary: 'Get athlete subscription',
    description: 'Get active subscription for a specific athlete'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Subscription retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'No active subscription found'
  })
  async getAthleteSubscription(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_athlete_subscription', athleteId)
    )
  }

  @Get('athlete/:id/all-data')
  @ApiOperation({
    summary: 'Get all payment data',
    description: 'Get all payment data for a specific athlete'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Payment data retrieved successfully'
  })
  async getAllPaymentData(@Param('id') athleteId: string) {
    return await firstValueFrom(
      this.paymentClient.send('get_all_payment_data', athleteId)
    )
  }

  @Get('methods')
  @ApiOperation({
    summary: 'Get payment methods',
    description: 'Get available payment methods'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully'
  })
  async getPaymentMethods() {
    return await firstValueFrom(
      this.paymentClient.send('get_payment_methods', {})
    )
  }

  @Post('athlete/:id/create')
  @ApiOperation({
    summary: 'Create payment record',
    description: 'Create a payment record for an athlete'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiBody({ type: CreatePaymentRecordDto })
  @ApiResponse({
    status: 201,
    description: 'Payment record created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Payment record created successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async createPaymentRecord(
    @Param('id') athleteId: string,
    @Body()
    paymentData: CreatePaymentRecordDto
  ): Promise<{ message: string }> {
    Logger.log(
      `Creating payment record for athlete ${athleteId} with data: ${JSON.stringify(paymentData)}`
    )
    return await firstValueFrom(
      this.paymentClient.send('create_payment_record', {
        athleteId,
        paymentData
      })
    )
  }

  @Get('athletes-with-payments')
  @ApiOperation({
    summary: 'Get athletes with payments',
    description:
      'Get all athletes with their payment information (admin/auxiliar only)'
  })
  @ApiResponse({
    status: 200,
    description: 'Athletes with payments retrieved successfully'
  })
  async getAthletesWithPayments() {
    return await firstValueFrom(
      this.paymentClient.send('get_athletes_with_payments', {})
    )
  }
}
