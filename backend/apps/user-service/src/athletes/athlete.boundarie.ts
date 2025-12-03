import { Athlete } from './athlete.entity'

export interface SubscriptionUpdateData {
  payment_id: string
  amount: number
  payment_date: string
}

export abstract class AthleteRepository {
  abstract save(athlete: Athlete): Promise<void>
  abstract findById(id: string): Promise<Athlete | null>
  abstract findAll(): Promise<any>
  abstract findDistribution(): Promise<any>
  abstract generateVerificationCode(
    userId: string
  ): Promise<{ verificationId: string }>
  abstract remove(id: string): Promise<void>
  abstract getAthleteSchedule(athleteId: string): Promise<any>
  abstract getScheduleFromLevel(
    level: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<number>
  abstract assignSchedule(
    athleteId: string,
    scheduleId: number,
    planId?: string
  ): Promise<void>
  abstract updateEnrollment(
    athleteId: string,
    subscriptionId: string
  ): Promise<void>
  abstract decrementSpot(scheduleId: number): Promise<void>
  abstract getEnrollmentRequests(athleteId: string): Promise<any>
  abstract createAthlete(data: any): Promise<any>
  abstract updateAthlete(id: string, dto: any): Promise<any>
  abstract deleteAthlete(id: string): Promise<any>
}
