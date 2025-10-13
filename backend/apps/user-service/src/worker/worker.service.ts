import { Injectable, Logger } from '@nestjs/common'
import {
  Assistant,
  Athlete,
  AthleteLevel,
  AthletePaymentSummary,
  CreateAssistantDto,
  EnrollmentStatus,
  OperationResponse,
  UpdateAssistantDto,
  WorkerRepository
} from './worker.repository'
import { Resend } from 'resend'
import { ConfigService } from '@nestjs/config'
import { WorkerErrorHandler } from './worker.errors'

// Response DTOs
export interface AthleteDistribution {
  beginner: number
  intermediate: number
  advanced: number
}

export interface CreateAssistantServiceResponse {
  message: string
}

@Injectable()
export class WorkerService {
  private readonly resend: Resend
  private readonly logger = new Logger(WorkerService.name)

  constructor(
    private readonly workerRepository: WorkerRepository,
    private readonly configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY')
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY not configured - email functionality will not work'
      )
    }
    this.resend = new Resend(apiKey)
  }

  async getAllAssistants(): Promise<Assistant[]> {
    try {
      return await this.workerRepository.findAllAssistants()
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'getAllAssistants')
    }
  }

  async getAllAthletes(): Promise<Athlete[]> {
    try {
      return await this.workerRepository.findAllAthletes()
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'getAllAthletes')
    }
  }

  async getAthleteDistribution(): Promise<AthleteDistribution> {
    try {
      const athleteLevels = await this.workerRepository.getAthleteLevels()

      const levels = athleteLevels.map((athlete) => athlete.level)

      const distribution: AthleteDistribution = {
        beginner: levels.filter((level) => level === 'beginner').length,
        intermediate: levels.filter((level) => level === 'intermediate').length,
        advanced: levels.filter((level) => level === 'advanced').length
      }

      this.logger.log(
        `Athlete distribution - Beginner: ${distribution.beginner}, ` +
          `Intermediate: ${distribution.intermediate}, Advanced: ${distribution.advanced}`
      )

      return distribution
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'getAthleteDistribution')
    }
  }

  async updateAthleteStatus(
    id: string,
    status: EnrollmentStatus
  ): Promise<OperationResponse> {
    try {
      return await this.workerRepository.updateAthleteStatus(id, status)
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'updateAthleteStatus')
    }
  }

  async updateAthleteLevel(
    id: string,
    level: AthleteLevel
  ): Promise<OperationResponse> {
    try {
      return await this.workerRepository.updateAthleteLevel(id, level)
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'updateAthleteLevel')
    }
  }

  async createAssistant(
    data: CreateAssistantDto
  ): Promise<CreateAssistantServiceResponse> {
    try {
      const result = await this.workerRepository.createAssistant(data)

      if (!result.data) {
        this.logger.error('No credentials returned from repository')
        return { message: result.message }
      }

      const { email, password } = result.data

      // Send credentials email (non-blocking)
      this.sendEmail(email, password, 'auxiliar administrativo')
        .then(() => {
          this.logger.log(`Credentials email sent successfully to ${email}`)
        })
        .catch((err) => {
          this.logger.error(
            `Failed to send credentials email to ${email}: ${err.message}`
          )
        })

      return { message: result.message }
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'createAssistant')
    }
  }

  async updateAssistant(
    id: string,
    dto: UpdateAssistantDto
  ): Promise<OperationResponse> {
    try {
      return await this.workerRepository.updateAssistant(id, dto)
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'updateAssistant')
    }
  }

  async deleteAssistant(id: string): Promise<OperationResponse> {
    try {
      return await this.workerRepository.deleteAssistant(id)
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'deleteAssistant')
    }
  }

  async getAthletesWithPayments(): Promise<AthletePaymentSummary[]> {
    try {
      return await this.workerRepository.getAthletesWithPayments()
    } catch (error) {
      WorkerErrorHandler.handleServiceError(error, 'getAthletesWithPayments')
    }
  }

  private async sendEmail(
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Tu Servicio <no-reply@fisib22.com>',
        to: email,
        subject: `Cuenta de ${role} - Credenciales de Acceso`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Bienvenido</h2>
            <p>Hola,</p>
            <p>Se ha creado tu cuenta como <strong>${role}</strong>.</p>
            <h3>Credenciales de acceso:</h3>
            <table style="border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; font-weight: bold;">Email:</td>
                <td style="padding: 10px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Contraseña:</td>
                <td style="padding: 10px; font-family: monospace; background: #f4f4f4;">${password}</td>
              </tr>
            </table>
            <p style="color: #666; font-size: 12px;">
              Por favor, cambia tu contraseña después de iniciar sesión por primera vez.
            </p>
          </div>
        `
      })
    } catch (error) {
      this.logger.error(`Email sending failed: ${error.message}`)
      throw error
    }
  }
}
