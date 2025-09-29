import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { UpdateProfileDto, ActionResponse } from './dto/update-profile.dto'
import { uploadImage } from './utils'
import { randomUUID } from 'crypto'
import { AthleteFormData } from './dto/athlete-form-data'
import { Resend } from 'resend'
@Injectable()
export class UserService {
  private supabase: SupabaseClient

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
    )
  }

  // Atletas
  async getAthleteById(id: string) {
    const { data, error } = await this.supabase.rpc('get_athlete_data', {
      athlete_uuid: id
    })

    if (error) {
      throw new Error(`Error fetching athlete: ${error.message}`)
    }
    return data
  }

  async getProfileById(userId: string) {
    const { data, error } = await this.supabase
      .schema('users')
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(`Error fetching profile: ${error.message}`)
    }

    return data
  }

  async getLatestAvatarChangeById(id: string) {
    const { data: profile, error } = await this.supabase
      .schema('users')
      .from('profiles')
      .select('last_avatar_change')
      .eq('id', id)
      .single()
    if (error) {
      console.log(error)
      throw new Error('Error al obtener datos de perfil')
    }
    return { status: 200, data: profile.last_avatar_change }
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    userId: string
  ): Promise<ActionResponse> {
    try {
      // Get current profile to check last update
      const { data: profile, error: profileError } = await this.supabase
        .schema('users')
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        return {
          status: 500,
          message: profileError.message
        }
      }

      // Verify if last_profile_update is more than 30 days
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      const lastUpdate = new Date(profile.last_profile_update).getTime()
      const currentDate = new Date().getTime()

      if (currentDate - lastUpdate < thirtyDays) {
        return {
          status: 400,
          message: 'Solo puedes actualizar tu perfil una vez al mes'
        }
      }

      // Update profile
      const { error } = await this.supabase
        .schema('users')
        .from('profiles')
        .update({
          first_name: updateProfileDto.firstName,
          paternal_last_name: updateProfileDto.paternalLastName,
          maternal_last_name: updateProfileDto.maternalLastName,
          phone: updateProfileDto.phone,
          last_profile_update: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        return {
          status: 500,
          message: error.message
        }
      }

      return {
        status: 200,
        message: 'Perfil actualizado correctamente'
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Error interno del servidor'
      }
    }
  }
  async getLastProfileUpdateDate(
    id: string
  ): Promise<{ status: number; data: string }> {
    const { data: profile, error } = await this.supabase
      .schema('users')
      .from('profiles')
      .select('last_profile_update')
      .eq('id', id)
      .single()
    if (error) {
      throw new Error('Error al obtener datos de perfil')
    }
    return { status: 200, data: profile.last_profile_update }
  }
  async changeAvatar(file: any, id: string): Promise<ActionResponse> {
    // El archivo ya viene como buffer desde Multer
    const buffer = file.buffer
    const res = await uploadImage(buffer)
    try {
      const { error } = await this.supabase
        .schema('users')
        .from('profiles')
        .update({
          avatar_url: res.secure_url,
          last_avatar_change: new Date()
        })
        .match({ id: id })

      if (error) {
        return {
          status: 500,
          message: error.message
        }
      }

      return {
        status: 200,
        message: 'Avatar change date updated successfully'
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error'
      }
    }
  }
  async getGenerateVerificationCodeById(
    id: string
  ): Promise<{ status: number; data: string }> {
    const { data: athlete, error } = await this.supabase
      .schema('users')
      .from('athletes')
      .select('verification_id')
      .eq('athlete_id', id)
      .single()
    if (error) {
      console.log(error)
      throw new Error('Error al obtener datos del deportista')
    }
    // Generate a new verification_id and update the athlete's record.
    const verification_id = randomUUID()
    const { error: updateError } = await this.supabase
      .schema('users')
      .from('athletes')
      .update({ verification_id })
      .eq('athlete_id', id)
    if (updateError) {
      console.log(updateError)
      throw new Error('Error al generar código de verificación')
    }
    return { status: 200, data: verification_id }
  }

  async getShifts() {
    // Retrieve shifts from the "shifts" table.
    const { data: shifts, error: shiftError } = await this.supabase
      .schema('users')
      .from('shifts')
      .select('*')
    if (shiftError || !shifts) {
      console.log(shiftError)
      return { status: 500, data: null }
    }

    // Retrieve schedules from the "schedules" table.
    const { data: schedules, error: schedulesError } = await this.supabase
      .schema('users')
      .from('schedules')
      .select('*')
    if (schedulesError) {
      console.log(schedulesError)
      return { status: 500, data: null }
    }

    // Map schedules to the desired shift structure.
    const res = schedules.map((schedule: any) => {
      const id = schedule.level as 'beginner' | 'intermediate' | 'advanced'
      const name = schedule.schedule_name
      // Find weekdays for the current schedule.
      const days = shifts
        .filter((shift: any) => shift.schedule_id === schedule.schedule_id)
        .map((shift: any) => shift.weekday)
      const description = `${schedule.start_time} - ${schedule.end_time} (${days.join(', ')})`
      const spots = schedule.available_spot as number
      return { id, name, description, spots }
    })

    return res
  }

  async addAthlete(data: AthleteFormData): Promise<any> {
    // Validación de datos (puedes usar class-validator en el DTO)
    // Aquí asume que los datos ya vienen validados

    // Supabase signup
    const password = 'GeneraUnPasswordSeguroAquí' // Implementa tu lógica
    const { data: signupData, error: signupError } =
      await this.supabase.auth.signUp({
        email: data.email,
        password: password
      })

    if (signupError || !signupData) {
      return { error: 'Error al registrar deportista' }
    }

    await this.sendEmail(data.email, data.first_name, password, 'deportista')

    const options = {
      data: {
        first_name: data.first_name,
        paternal_last_name: data.paternal_last_name,
        maternal_last_name: data.maternal_last_name,
        birth_date: data.birth_date,
        dni: data.dni,
        level: data.level,
        role: 'deportista',
        avatar_url: null,
        phone: data.phone
      }
    }
    const { error: rpcError } = await this.supabase.rpc('process_new_user', {
      p_id: signupData.user?.id,
      p_raw_user_meta_data: options.data
    })
    if (rpcError) {
      return { error: 'Error al registrar deportista' }
    }

    return {
      status: 200,
      message: 'Deportista registrado correctamente',
      data: signupData.user
    }
  }
  private async sendEmail(
    recipientEmail: string,
    firstName: string,
    defaultPassword: string,
    role: string
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY as string)
    try {
      await resend.emails.send({
        from: 'Tu Servicio <no-reply@fisib22.com>',
        to: recipientEmail,
        subject: `Cuenta de ${role} - Credenciales de Acceso`,
        html: `<p>Hola ${firstName},</p>
             <p>Se ha creado tu cuenta como ${role}.</p>
             <p>Estas son tus credenciales:</p>
             <ul>
               <li><strong>Email:</strong> ${recipientEmail}</li>
               <li><strong>Contraseña:</strong> ${defaultPassword}</li>
             </ul>
             <p>Cambia tu contraseña en el primer inicio de sesión.</p>`
      })
    } catch (sendError) {
      console.error('Error enviando el email:', sendError)
      throw new Error('Error enviando email')
    }
  }
  async getAllAthletes() {
    const { data: athletes, error: athletesError } =
      await this.supabase.rpc('get_deportistas')

      console.log(athletesError, athletes)
    if (athletesError || !athletes) {
      console.log(athletesError)
      return { status: 500, data: null }
    }
    return { status: 200, data: athletes }
  }
  async getAllAssistants() {
    const { data: assistants, error: assistantsError } = await this.supabase
      .schema('users')
      .from('profiles')
      .select('*')
      .eq('role', 'auxiliar_administrativo')

    if (assistantsError || !assistants) {
      console.log(assistantsError)
      return { status: 500, data: null }
    }
    return { status: 200, data: assistants }
  }
  async getAthletesDistribution() {
    const { data, error } = await this.supabase
      .schema('users')
      .from('athletes')
      .select('level')
    if (error) {
      throw new Error('Error al obtener la distribución de deportistas')
    }
    const levels = data.map((athlete: any) => athlete.level)
    const beginner = levels.filter(
      (level: string) => level === 'beginner'
    ).length
    const intermediate = levels.filter(
      (level: string) => level === 'intermediate'
    ).length
    const advanced = levels.filter(
      (level: string) => level === 'advanced'
    ).length
    return { beginner, intermediate, advanced }
  }
  async deleteAthlete(id: string): Promise<ActionResponse> {
    const { error } = await this.supabase
      .schema('users')
      .from('athletes')
      .delete()
      .eq('athlete_id', id)

    if (error) {
      return {
        status: 500,
        message: error.message
      }
    }

    return {
      status: 200,
      message: 'Deportista eliminado correctamente'
    }
  }
}
