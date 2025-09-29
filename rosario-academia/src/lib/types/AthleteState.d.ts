interface AthleteState {
  id: string
  email: string
  athlete_id: string
  level: 'beginner' | 'intermediate' | 'advanced'
  height: string | null
  weight: string | null
  profile: Profile
  payments: Payment[] | null
  enrollment_requests: EnrollmentRequest[]
}
