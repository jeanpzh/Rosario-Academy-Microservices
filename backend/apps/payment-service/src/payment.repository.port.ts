import { Database } from './types/payment.type'

export type Payment = Database['payments']['Tables']['payments']['Row']
export type Subscription =
  Database['payments']['Tables']['subscriptions']['Row']
export type PaymentMethod =
  Database['payments']['Tables']['payment_methods']['Row'] & {
    payment_method_id: string
  }

export abstract class PaymentRepositoryPort {
  abstract getPlanAmount(planId: string): Promise<number>
  abstract findActiveSubscription(
    athleteId: string
  ): Promise<Subscription | null>
  abstract createSubscription(subscription: {
    athlete_id: string
    start_date: string
    end_date: string
    status: string
  }): Promise<Subscription>
  abstract updateSubscriptionEndDate(
    subscriptionId: string,
    endDate: string
  ): Promise<void>
  abstract findByPaymentId(
    paymentId: string
  ): Promise<Pick<Payment, 'amount' | 'payment_date'> | null>
  abstract findByExternalReference(
    externalReference: string
  ): Promise<Payment | null>

  abstract savePayment(
    payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
  ): Promise<void>

  abstract getPaymentsByAthleteId(
    athleteId: string
  ): Promise<
    (Pick<Payment, 'amount' | 'payment_date'> & { end_date: string | null })[]
  >
  abstract getPaymentMethods(): Promise<PaymentMethod[]>
  abstract createPaymentRecord(
    athleteId: string,
    paymentData: {
      amount: number
      payment_method_id: string
      transaction_reference: string
      payment_date: string
      subscription_start_date: string
      subscription_end_date: string
    }
  ): Promise<void>
}
