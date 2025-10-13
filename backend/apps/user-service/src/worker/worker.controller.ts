import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { WorkerService } from './worker.service'
import {
  Assistant,
  Athlete,
  AthleteLevel,
  AthletePaymentSummary,
  CreateAssistantDto,
  EnrollmentStatus,
  OperationResponse,
  UpdateAssistantDto
} from './worker.repository'
import {
  AthleteDistribution,
  CreateAssistantServiceResponse
} from './worker.service'

// Message payload interfaces for better type safety
interface UpdateAthleteStatusPayload {
  id: string
  status: EnrollmentStatus
}

interface UpdateAthleteLevelPayload {
  id: string
  level: AthleteLevel
}

interface UpdateAssistantPayload {
  id: string
  dto: UpdateAssistantDto
}

@Controller()
export class WorkerController {
  private readonly logger = new Logger(WorkerController.name)

  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern('get_all_assistants')
  async getAllAssistants(): Promise<Assistant[]> {
    this.logger.log('Received request: get_all_assistants')
    return this.workerService.getAllAssistants()
  }

  @MessagePattern('get_all_athletes')
  async getAllAthletes(): Promise<Athlete[]> {
    this.logger.log('Received request: get_all_athletes')
    return this.workerService.getAllAthletes()
  }

  @MessagePattern('get_athlete_distribution')
  async getAthleteDistribution(): Promise<AthleteDistribution> {
    this.logger.log('Received request: get_athlete_distribution')
    return this.workerService.getAthleteDistribution()
  }

  @MessagePattern('update_athlete_status')
  async updateAthleteStatus(
    @Payload() data: UpdateAthleteStatusPayload
  ): Promise<OperationResponse> {
    this.logger.log(`Updating athlete ${data.id} status to ${data.status}`)
    return this.workerService.updateAthleteStatus(data.id, data.status)
  }

  @MessagePattern('update_athlete_level')
  async updateAthleteLevel(
    @Payload() data: UpdateAthleteLevelPayload
  ): Promise<OperationResponse> {
    this.logger.log(`Updating athlete ${data.id} level to ${data.level}`)
    return this.workerService.updateAthleteLevel(data.id, data.level)
  }

  @MessagePattern('create_assistant')
  async createAssistant(
    @Payload() data: CreateAssistantDto
  ): Promise<CreateAssistantServiceResponse> {
    this.logger.log(`Creating assistant with email: ${data.email}`)
    return this.workerService.createAssistant(data)
  }

  @MessagePattern('update_assistant')
  async updateAssistant(
    @Payload() payload: UpdateAssistantPayload
  ): Promise<OperationResponse> {
    this.logger.log(`Updating assistant ${payload.id}`)
    return this.workerService.updateAssistant(payload.id, payload.dto)
  }

  @MessagePattern('delete_assistant')
  async deleteAssistant(@Payload() id: string): Promise<OperationResponse> {
    this.logger.log(`Deleting assistant ${id}`)
    return this.workerService.deleteAssistant(id)
  }

  @MessagePattern('get_athletes_with_payments')
  async getAthletesWithPayments(): Promise<AthletePaymentSummary[]> {
    this.logger.log('Received request: get_athletes_with_payments')
    return this.workerService.getAthletesWithPayments()
  }
}
