import { Injectable } from '@nestjs/common'
import { AthleteRepository } from './athlete.boundarie'

@Injectable()
export class AthleteCases {
  private readonly athleteRepository: AthleteRepository
  constructor(athleteRepository: AthleteRepository) {
    this.athleteRepository = athleteRepository
  }
  async getAthleteById(id: string) {
    return this.athleteRepository.findById(id)
  }
  async getAllAthletes() {
    return this.athleteRepository.findAll()
  }
  async getAthletesDistribution() {
    return this.athleteRepository.findDistribution()
  }
  async getAthleteSchedule(athleteId: string) {
    return this.athleteRepository.getAthleteSchedule(athleteId)
  }
  async getEnrollmentRequests(athleteId: string) {
    return this.athleteRepository.getEnrollmentRequests(athleteId)
  }
  async createVerificationCode(userId: string) {
    return this.athleteRepository.generateVerificationCode(userId)
  }

  async createAthlete(data: any) {
    return this.athleteRepository.createAthlete(data)
  }

  async updateAthlete(id: string, dto: any) {
    return this.athleteRepository.updateAthlete(id, dto)
  }

  async deleteAthlete(id: string) {
    return this.athleteRepository.deleteAthlete(id)
  }
}
