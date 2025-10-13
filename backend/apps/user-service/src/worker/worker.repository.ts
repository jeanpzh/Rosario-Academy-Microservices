import { Database } from '../user.database.types'

// Type definitions from database
type ProfileDB = Database['users']['Tables']['profiles']['Row']
export type Athlete =
  Database['users']['Functions']['get_athletes']['Returns'][0]
export type AthleteLevel =
  Database['users']['Tables']['athletes']['Row']['level']
export type EnrollmentStatus =
  Database['users']['Tables']['enrollment_requests']['Row']['status']

// Profile types
type Profile = Omit<
  ProfileDB,
  'last_avatar_change' | 'last_password_change' | 'last_profile_update' | 'role'
>
export type Assistant = Profile

// Payment summary type
export type AthletePaymentSummary =
  Database['users']['Views']['vw_athlete_payments_summary']['Row']

// DTOs for operations
export interface CreateAssistantDto {
  email: string
  first_name: string
  paternal_last_name: string
  maternal_last_name: string
  birth_date: string
  dni: string
  phone: string
}

export interface UpdateAssistantDto {
  first_name?: string
  paternal_last_name?: string
  maternal_last_name?: string
  birth_date?: string
  dni?: string
  phone?: string
  email?: string
}

// Response types
export interface OperationResponse {
  success: boolean
  message: string
}

export interface CreateAssistantResponse extends OperationResponse {
  data?: {
    email: string
    password: string
  }
}

// Repository interface
export abstract class WorkerRepository {
  abstract findAllAssistants(): Promise<Assistant[]>
  abstract findAllAthletes(): Promise<Athlete[]>
  abstract getAthleteLevels(): Promise<{ level: AthleteLevel }[]>
  abstract updateAthleteStatus(
    id: string,
    status: EnrollmentStatus
  ): Promise<OperationResponse>
  abstract updateAthleteLevel(
    id: string,
    level: AthleteLevel
  ): Promise<OperationResponse>
  abstract createAssistant(
    data: CreateAssistantDto
  ): Promise<CreateAssistantResponse>
  abstract updateAssistant(
    id: string,
    dto: UpdateAssistantDto
  ): Promise<OperationResponse>
  abstract deleteAssistant(id: string): Promise<OperationResponse>
  abstract getAthletesWithPayments(): Promise<AthletePaymentSummary[]>
}
