interface Payment {
  amount: number
  payment_method_id: string
  transaction_reference: string
  payment_date: string
  subscription_start_date: string
  subscription_end_date: string
  payment_method_name: string
}
interface PaymentWithEndDate extends Payment {
  end_date: string | null
}
interface PaymentMethods {
  payment_method_id: string
  method_name: string
  created_at: string
}
