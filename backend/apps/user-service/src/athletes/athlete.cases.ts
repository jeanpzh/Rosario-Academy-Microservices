import { Injectable, Logger } from '@nestjs/common'
import { AthleteRepository } from './athlete.boundarie'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class AthleteCases {
  private readonly athleteRepository: AthleteRepository
  private readonly resend: Resend
  private readonly logger = new Logger(AthleteCases.name)

  constructor(
    athleteRepository: AthleteRepository,
    private readonly configService: ConfigService
  ) {
    this.athleteRepository = athleteRepository
    const apiKey = this.configService.get<string>('RESEND_API_KEY')
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY not configured - email functionality will not work'
      )
    }
    this.resend = new Resend(apiKey)
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
    const result = await this.athleteRepository.createAthlete(data)

    if (result.credentials) {
      const { email, password } = result.credentials
      this.sendCredentialsEmail(email, password)
        .then(() => {
          this.logger.log(`Credentials email sent successfully to ${email}`)
        })
        .catch((err) => {
          this.logger.error(
            `Failed to send credentials email to ${email}: ${err.message}`
          )
        })
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  }

  private async sendCredentialsEmail(
    email: string,
    password: string
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Tu Servicio <no-reply@fisib22.com>',
        to: email,
        subject: 'Cuenta de Deportista - Credenciales de Acceso',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Bienvenido a Rosario Academia</h2>
            <p>Hola,</p>
            <p>Se ha creado tu cuenta como <strong>deportista</strong>.</p>
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

  async updateAthlete(id: string, dto: any) {
    return this.athleteRepository.updateAthlete(id, dto)
  }

  async deleteAthlete(id: string) {
    return this.athleteRepository.deleteAthlete(id)
  }
}
