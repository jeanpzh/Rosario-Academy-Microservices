interface Athlete {
  level: 'beginner' | 'intermediate' | 'advanced'
  height: string | null
  weight: string | null
}
interface AthleteWithPayments {
  id: string
  first_name: string
  paternal_last_name: string
  maternal_last_name: string
  avatar_url: string
  payments_count: number
  payments_sum_amount: number
}
