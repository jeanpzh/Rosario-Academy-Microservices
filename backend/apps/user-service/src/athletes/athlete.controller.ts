import { Controller, Logger } from '@nestjs/common'
import { AthleteCases } from './athlete.cases'
import { MessagePattern } from '@nestjs/microservices'
@Controller()
export class AthleteController {
  private readonly athleteCases: AthleteCases
  constructor(athleteCases: AthleteCases) {
    this.athleteCases = athleteCases
  }
  @MessagePattern('get_athlete_by_id')
  async getProfile(athleteId: string) {
    Logger.log(`Getting athlete by id ${athleteId}`)
    return this.athleteCases.getAthleteById(athleteId)
  }
  @MessagePattern('get_all_athletes')
  async getAllAthletes() {
    return this.athleteCases.getAllAthletes()
  }
  @MessagePattern('get_athletes_distribution')
  async getAthletesDistribution() {
    return this.athleteCases.getAthletesDistribution()
  }
  @MessagePattern('get_athlete_schedule')
  async getSchedule(athleteId: string) {
    return this.athleteCases.getAthleteSchedule(athleteId)
  }
  @MessagePattern('get_athlete_enrollment_requests')
  async getEnrollmentRequests(athleteId: string) {
    return this.athleteCases.getEnrollmentRequests(athleteId)
  }
  @MessagePattern('generate_verification_code')
  async generateVerificationCode({ userId }: { userId: string }) {
    return this.athleteCases.createVerificationCode(userId)
  }

  @MessagePattern('create_athlete')
  async createAthlete(data: any) {
    Logger.log(`Creating athlete with data: ${JSON.stringify(data)}`)
    return this.athleteCases.createAthlete(data)
  }

  @MessagePattern('update_athlete')
  async updateAthlete(payload: { id: string; dto: any }) {
    Logger.log(
      `Updating athlete ${payload.id} with data: ${JSON.stringify(payload.dto)}`
    )
    return this.athleteCases.updateAthlete(payload.id, payload.dto)
  }

  @MessagePattern('delete_athlete')
  async deleteAthlete(id: string) {
    Logger.log(`Deleting athlete ${id}`)
    return this.athleteCases.deleteAthlete(id)
  }
}
