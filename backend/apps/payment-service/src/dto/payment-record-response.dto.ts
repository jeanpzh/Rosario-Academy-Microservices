import { Expose } from 'class-transformer'

@Expose()
export class PaymentRecordResponseDto {
  @Expose()
  payment: {
    payment_id: string
    athlete_id: string
    amount: number
    payment_date: string | null
    payment_method_id: string
    transaction_reference: string | null
    subscription_id: string | null
  }

  @Expose()
  subscription: {
    id: string
    athlete_id: string
    start_date: string
    end_date: string
    status: string
    created_at: string | null
    updated_at: string | null
  }

  constructor(payment: any, subscription: any) {
    this.payment = payment
    this.subscription = subscription
  }
}
