import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import {
  Payment,
  PaymentMethod,
  PaymentRepositoryPort,
  Subscription
} from '../payment.repository.port'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/payment.type'
import { CacheBoundarie } from '@common/cache/cache.boundarie'

@Injectable()
export class PaymentRepository implements PaymentRepositoryPort {
  constructor(
    private readonly supabaseClient: SupabaseClient<Database>,
    private cache: CacheBoundarie
  ) {}

  async getPlanAmount(planId: string): Promise<number> {
    const cached = await this.cache.get<number>(`plan_amount_${planId}`)

    if (cached) return cached

    const { data, error } = await this.supabaseClient
      .schema('payments')
      .from('plans')
      .select('amount')
      .eq('id', planId)
      .single()

    if (error || !data) {
      throw new BadRequestException(
        `Error obteniendo el monto del plan: ${error?.message || 'Plan no encontrado'}`
      )
    }
    this.cache.set(`plan_amount_${planId}`, data.amount, 3600)

    return data.amount
  }

  async findActiveSubscription(
    athleteId: string
  ): Promise<Subscription | null> {
    const { data, error } = await this.supabaseClient
      .schema('payments')
      .from('subscriptions')
      .select('*')
      .eq('athlete_id', athleteId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new BadRequestException(
        `Error retrieving subscription: ${error.message}`
      )
    }

    return data
  }

  async createSubscription(subscription: {
    athlete_id: string
    start_date: string
    end_date: string
    status: string
  }): Promise<Subscription> {
    const { data, error } = await this.supabaseClient
      .schema('payments')
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single()

    if (error || !data) {
      throw new BadRequestException(
        `Error creating subscription: ${error?.message}`
      )
    }

    return data
  }

  async updateSubscriptionEndDate(
    subscriptionId: string,
    endDate: string
  ): Promise<void> {
    const { error } = await this.supabaseClient
      .schema('payments')
      .from('subscriptions')
      .update({
        end_date: endDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
    if (error) {
      throw new BadRequestException(
        `Error updating subscription: ${error.message}`
      )
    }
  }

  async findByPaymentId(paymentId: string): Promise<Payment | null> {
    try {
      const cached = await this.cache.get<Payment>(`payment_${paymentId}`)
      if (cached) return cached

      const { data, error } = await this.supabaseClient
        .schema('payments')
        .from('payments')
        .select('*')
        .eq('payment_id', paymentId)
        .single()

      if (error || !data) {
        Logger.error('Error obteniendo el pago:', error)
        return null
      }
      this.cache.set(`payment_${paymentId}`, data, 3600)
      return data[0]
    } catch (error) {
      Logger.error('Error obteniendo el pago:', error)
      return null
    }
  }

  async savePayment(
    payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<void> {
    const { error } = await this.supabaseClient
      .schema('payments')
      .from('payments')
      .insert(payment)
    if (error) {
      throw new BadRequestException(
        `Error guardando el pago: ${error?.message || 'Error desconocido'}`
      )
    }
  }

  async findByExternalReference(
    externalReference: string
  ): Promise<Payment | null> {
    const { data, error } = await this.supabaseClient
      .schema('payments')
      .from('payments')
      .select('*')
      .eq('transaction_reference', externalReference)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new BadRequestException(`Error finding payment: ${error.message}`)
    }

    return data
  }

  async getPaymentsByAthleteId(
    athleteId: string
  ): Promise<
    (Pick<Payment, 'amount' | 'payment_date'> & { end_date: string | null })[]
  > {
    try {
      const { data, error } = await this.supabaseClient
        .schema('payments')
        .from('payments')
        .select(
          'amount, payment_date, subscriptions(end_date), payment_methods(method_name)'
        )
        .eq('athlete_id', athleteId)

      if (error) {
        throw new BadRequestException(
          `Error fetching payments: ${error.message}`
        )
      }

      return data.map((payment) => ({
        amount: payment.amount,
        payment_date: payment.payment_date,
        end_date: payment.subscriptions?.end_date!,
        payment_method_name: payment.payment_methods?.method_name!
      }))
    } catch (error) {
      Logger.error('Error fetching payments by athlete ID:', error)
      throw new BadRequestException('Error fetching payments')
    }
  }
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await this.supabaseClient
      .schema('payments')
      .from('payment_methods')
      .select('*')
    if (error) {
      throw new BadRequestException(
        `Error fetching payment methods: ${error.message}`
      )
    }
    // Mapear 'id' a 'payment_method_id' para mantener consistencia con el frontend
    return data.map((method) => ({
      ...method,
      payment_method_id: method.id
    }))
  }

  async createPaymentRecord(
    athleteId: string,
    paymentData: {
      amount: number
      payment_method_id: string
      transaction_reference: string
      payment_date: string
      subscription_start_date: string
      subscription_end_date: string
    }
  ): Promise<void> {
    Logger.log(JSON.stringify(paymentData))
    const subscription = await this.createSubscription({
      athlete_id: athleteId,
      start_date: paymentData.subscription_start_date,
      end_date: paymentData.subscription_end_date,
      status: 'active'
    })

    await this.savePayment({
      payment_id: `PAY_${Date.now()}_${athleteId.slice(0, 8)}`,
      athlete_id: athleteId,
      amount: paymentData.amount,
      payment_date: paymentData.payment_date,
      payment_method_id: paymentData.payment_method_id,
      transaction_reference: paymentData.transaction_reference,
      subscription_id: subscription.id
    })

    // Invalidate enrollment requests cache after payment is processed
    await this.cache.delete(`enrollment_requests_${athleteId}`)
    Logger.log(`Invalidated enrollment_requests cache for athlete ${athleteId}`)
  }
}
