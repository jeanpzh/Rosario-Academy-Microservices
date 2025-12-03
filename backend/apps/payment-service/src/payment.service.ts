import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import MercadoPagoConfig, { Preference } from 'mercadopago'
import { PaymentRepositoryPort } from './payment.repository.port'
import { CreatePreferenceDto, PreferenceResponseDto } from './dto'

@Injectable()
export class PaymentService {
  private mercadopago: MercadoPagoConfig

  constructor(
    private configService: ConfigService,
    private paymentRepository: PaymentRepositoryPort
  ) {
    this.mercadopago = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN')!
    })
  }

  async createPreference(
    data: CreatePreferenceDto
  ): Promise<PreferenceResponseDto> {
    const unitPrice = await this.paymentRepository.getPlanAmount(data.planId)

    if (!unitPrice) throw new BadRequestException('Plan no encontrado')

    const frontendUrl = this.configService.get<string>('FRONTEND_URL')
    if (!frontendUrl) {
      throw new BadRequestException('FRONTEND_URL not configured')
    }

    Logger.debug('Creating preference with data:', data, unitPrice)

    try {
      const externalReference = this.generateExternalReference(
        data.userId,
        data.planId
      )

      const preference = await new Preference(this.mercadopago).create({
        body: {
          external_reference: externalReference,
          items: [
            {
              id: `PLAN_${data.planId}`,
              title: 'Pago de Matrícula y Suscripción - Academia Rosario',
              quantity: 1,
              currency_id: 'PEN',
              description:
                'Pago para inscripción y creación/renovación de suscripción',
              unit_price: 2 // Deberia ser UNIT PRICE, pero por efectos de prueba se deja en 2
            }
          ],
          metadata: {
            athlete_id: data.userId,
            schedule_id: data.schedule_id,
            payment_type: 'subscription',
            planId: data.planId,
            amount: unitPrice,
            created_at: new Date().toISOString()
          },

          back_urls: {
            success: `${frontendUrl}/dashboard/athlete/payments?status=success&external_reference=${externalReference}`,
            failure: `${frontendUrl}/dashboard/athlete/payments?status=failure&external_reference=${externalReference}`,
            pending: `${frontendUrl}/dashboard/athlete/payments?status=pending&external_reference=${externalReference}`
          },
          auto_return: 'approved',

          statement_descriptor: 'ACAD_ROSARIO'
        }
      })

      return new PreferenceResponseDto(preference.init_point!)
    } catch (error) {
      console.error('Error creating preference:', error)
      throw new BadRequestException(
        `Error creating preference: ${error.message}`
      )
    }
  }

  async getAthletePayments(athleteId: string) {
    return this.paymentRepository.getPaymentsByAthleteId(athleteId)
  }
  private generateExternalReference(id: string, planId: string): string {
    return `${id}_${planId}_${Date.now()}`
  }
  async getPaymentMethods() {
    return this.paymentRepository.getPaymentMethods()
  }
  async createPaymentRecord(data: {
    athleteId: string
    paymentData: {
      amount: number
      payment_method_id: string
      transaction_reference: string
      payment_date: string
      subscription_start_date: string
      subscription_end_date: string
    }
  }): Promise<{ message: string }> {
    await this.paymentRepository.createPaymentRecord(
      data.athleteId,
      data.paymentData
    )

    return {
      message: 'Payment record created successfully'
    }
  }
}
