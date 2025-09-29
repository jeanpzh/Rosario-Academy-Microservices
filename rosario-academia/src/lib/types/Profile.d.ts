export interface Profile {
  id?: string
  dni?: string | undefined
  avatar_url?: string | undefined
  birth_date?: string | undefined
  first_name: string
  paternal_last_name: string
  maternal_last_name: string
  last_avatar_change?: string | null
  days_remaining?: number | null
}
