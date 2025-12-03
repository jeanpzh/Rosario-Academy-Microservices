import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import { Athlete } from './athlete.entity'
import { Database } from '../user.database.types'
import { AthleteRepository } from './athlete.boundarie'
import { SUPABASE_CLIENT } from '@common/supabase/supabase.provider'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { randomBytes, randomUUID } from 'crypto'

@Injectable()
export class AthleteRepositoryImpl implements AthleteRepository {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabaseClient: SupabaseClient<Database>,
    private cache: CacheBoundarie
  ) {}

  async save(athlete: Athlete): Promise<void> {
    Logger.debug(`Saving athlete ${JSON.stringify(athlete)} to database`)
    const { error } = await this.supabaseClient
      .schema('users')
      .from('athletes')
      .insert({
        athlete_id: athlete._user.id,
        level: athlete._level as 'beginner' | 'intermediate' | 'advanced'
      })
    if (error) {
      Logger.error(error.message)
      throw new BadRequestException('Error al guardar el atleta')
    }
  }

  async getScheduleFromLevel(
    level: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<number> {
    const { data, error } = await this.supabaseClient
      .schema('users')
      .from('schedules')
      .select('schedule_id')
      .eq('level', level)
      .single()

    if (error || !data) {
      Logger.error(error)
      throw new BadRequestException('Error al obtener el horario')
    }
    return data.schedule_id
  }
  async assignSchedule(
    athleteId: string,
    scheduleId: number,
    planId?: string
  ): Promise<void> {
    const { error } = await this.supabaseClient
      .schema('users')
      .from('enrollment_requests')
      .insert({
        athlete_id: athleteId,
        status: 'pending',
        requested_schedule_id: scheduleId,
        requested_plan_id: planId ?? null,
        request_date: new Date().toISOString()
      })
    if (error) {
      Logger.error(error.message)
      throw new BadRequestException('Error al asignar el horario')
    }
  }

  async findById(id: string): Promise<any | null> {
    try {
      const cached = await this.cache.get<any>(`athlete_${id}`)
      if (cached) {
        Logger.log(`Cache hit for athlete ${id}`)
        return cached
      }
      const { data: athlete, error } = await this.supabaseClient
        .schema('users')
        .from('athletes')
        .select(
          `
          weight,
          height,
          level
          `
        )
        .eq('athlete_id', id)
        .single()

      if (error || !athlete) {
        Logger.error(error)
        throw new BadRequestException('Atleta no encontrado')
      }

      await this.cache.set(`athlete_${id}`, athlete, 300)
      return athlete
    } catch (error) {
      Logger.error(error)
      throw new BadRequestException(error.message)
    }
  }
  async findAll(): Promise<any> {
    try {
      const cached = await this.cache.get<Athlete[]>(`all_athletes`)
      if (cached) {
        Logger.log('Cache hit for all athletes')
        return cached
      }
      const { data, error } = await this.supabaseClient
        .schema('users')
        .rpc('get_athletes')
      if (error || !data) {
        Logger.error(error)
        throw new BadRequestException('Error al obtener los atletas')
      }
      await this.cache.set(`all_athletes`, data, 300)
    } catch (error) {
      Logger.error(error)
      throw new BadRequestException('Error al obtener los atletas')
    }
  }
  async findDistribution(): Promise<any> {
    try {
      const cached = await this.cache.get<any>(`athlete_distribution`)
      if (cached) {
        Logger.log('Cache hit for athlete distribution')
        return cached
      }
      const { data, error } = await this.supabaseClient
        .schema('users')
        .rpc('get_athlete_distribution')

      if (error || !data) {
        Logger.error(error)
        throw new BadRequestException(
          'Error al obtener la distribución de atletas'
        )
      }
      await this.cache.set(`athlete_distribution`, data, 300)
      return data
    } catch (error) {
      if (error instanceof PostgrestError) {
        Logger.error(error.message)
        throw new BadRequestException(
          'Error al obtener la distribución de atletas'
        )
      }
      Logger.error(error)
      throw new BadRequestException(
        'Error al obtener la distribución de atletas'
      )
    }
  }
  async remove(id: string): Promise<void> {
    await this.cache.delete(`athlete_${id}`)
    const { error } = await this.supabaseClient
      .schema('users')
      .from('athletes')
      .delete()
      .eq('athlete_id', id)

    if (error) {
      Logger.error(error.message)
      throw new BadRequestException('Error al eliminar el atleta')
    }
  }
  async generateVerificationCode(
    userId: string
  ): Promise<{ verificationId: string }> {
    try {
      const athlete = await this.findById(userId)

      if (!athlete) {
        Logger.error('Atleta no encontrado')
        throw new BadRequestException(
          'Atleta no encontrado para generar código de verificación'
        )
      }

      const verificationId = randomUUID()
      const { error } = await this.supabaseClient
        .schema('users')
        .from('athletes')
        .upsert({
          athlete_id: userId,
          level: athlete.level,
          verification_id: verificationId
        })

      if (error) {
        Logger.error(error?.message)
        throw new BadRequestException(
          'Error al generar el código de verificación'
        )
      }

      return { verificationId }
    } catch (error) {
      Logger.error(error)
      throw new BadRequestException(
        'Error al generar el código de verificación'
      )
    }
  }
  async getAthleteSchedule(athleteId: string): Promise<any> {
    try {
      const cached = await this.cache.get<any>(`athlete_schedule_${athleteId}`)
      if (cached) {
        Logger.log(`Cache hit for athlete schedule ${athleteId}`)
        return cached
      }
      const { data, error } = await this.supabaseClient
        .schema('users')
        .rpc('get_athlete_schedule', { p_athlete_id: athleteId })
        .select(`schedule_name, start_time, end_time, weekday`)

      if (error) {
        Logger.error(error)
        throw new BadRequestException('Error al obtener el horario del atleta')
      }

      if (!data) {
        throw new BadRequestException('No schedule found for the athlete')
      }

      await this.cache.set(`athlete_schedule_${athleteId}`, data, 300)
      return data
    } catch (error) {
      Logger.error(error)
      throw new BadRequestException('Error al obtener el horario del atleta')
    }
  }

  /**
   * Update athlete subscription status after payment is processed
   */
  async updateEnrollment(
    athleteId: string,
    subscriptionId: string
  ): Promise<void> {
    try {
      Logger.log(
        `Updating subscription status for athlete ${athleteId}, subscription ${subscriptionId}`
      )

      // Invalidate athlete cache
      await this.cache.delete(`enrollment_requests_${athleteId}`)

      const { error, data } = await this.supabaseClient
        .schema('users')
        .from('enrollment_requests')
        .update({
          status: 'approved',
          subscription_id: subscriptionId
        })
        .eq('athlete_id', athleteId)

      if (error) {
        Logger.error(`Error updating subscription: ${error.message}`)
        throw new BadRequestException(
          'Error al actualizar el estado de la suscripción'
        )
      }

      Logger.log(
        `Successfully updated subscription ${subscriptionId} for athlete ${athleteId}`
      )
      await this.cache.set(`athlete_${athleteId}`, data, 300)
    } catch (error) {
      Logger.error(
        `Failed to update subscription status: ${error.message}`,
        error.stack
      )
      throw new BadRequestException(
        'Error al actualizar el estado de la suscripción'
      )
    }
  }
  async decrementSpot(scheduleId: number): Promise<void> {
    try {
      Logger.log(`Decrementing spot for schedule ${scheduleId}`)
      const { error } = await this.supabaseClient
        .schema('users')
        .rpc('decrement_available_spot', { p_schedule_id: scheduleId })

      if (error) {
        Logger.error(`Error decrementing spot: ${error.message}`)
        throw new BadRequestException('Error al decrementar el cupo')
      }

      Logger.log(`Successfully decremented spot for schedule ${scheduleId}`)
    } catch (error) {
      Logger.error(`Failed to decrement spot: ${error.message}`, error.stack)
      throw new BadRequestException('Error al decrementar el cupo')
    }
  }
  async getEnrollmentRequests(athleteId: string): Promise<any> {
    try {
      const { data, error } = await this.supabaseClient
        .schema('users')
        .from('enrollment_requests')
        .select(
          'requested_schedule_id(plan_id, schedule_id), status, request_date'
        )
        .eq('athlete_id', athleteId)
        .order('request_date', { ascending: false })

      Logger.log(
        `Fetched enrollment requests for athlete ${athleteId}: ${JSON.stringify(data)}`
      )

      if (error) {
        Logger.error(`Error fetching enrollment requests: ${error.message}`)
        throw new BadRequestException(
          'Error al obtener las solicitudes de inscripción'
        )
      }

      if (!data || data.length === 0) {
        return null
      }

      // Priorizar el request aprobado si existe
      const approvedRequest = data.find((req) => req.status === 'approved')
      if (approvedRequest) {
        return approvedRequest
      }

      // Si no hay aprobado, devolver el más reciente
      return data[0]
    } catch (error) {
      Logger.error(
        `Failed to fetch enrollment requests: ${error.message}`,
        error.stack
      )
      throw new BadRequestException(
        'Error al obtener las solicitudes de inscripción'
      )
    }
  }

  async createAthlete(data: any): Promise<any> {
    try {
      Logger.log(`Creating athlete with data: ${JSON.stringify(data)}`)

      const password = randomBytes(16).toString('hex')

      const { data: signupData, error: signupError } =
        await this.supabaseClient.auth.admin.createUser({
          email: data.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            first_name: data.first_name,
            paternal_last_name: data.paternal_last_name,
            maternal_last_name: data.maternal_last_name,
            birth_date: data.birth_date,
            dni: data.dni,
            level: data.level,
            role: 'deportista',
            avatar_url: data.avatar_url || null,
            phone: data.phone
          }
        })

      if (signupError || !signupData.user) {
        Logger.error(`Error creating auth user: ${signupError?.message}`)
        throw new BadRequestException('Error al registrar deportista')
      }

      const options = {
        first_name: data.first_name,
        paternal_last_name: data.paternal_last_name,
        maternal_last_name: data.maternal_last_name,
        birth_date: data.birth_date,
        dni: data.dni,
        level: data.level,
        role: 'deportista',
        avatar_url: data.avatar_url || null,
        phone: data.phone
      }

      const { error: rpcError } = await this.supabaseClient.rpc(
        'process_new_user',
        {
          p_id: signupData.user.id,
          p_email: data.email,
          p_raw_user_meta_data: options
        }
      )

      if (rpcError) {
        Logger.error(`Error processing new user: ${rpcError.message}`)
        throw new BadRequestException('Error al registrar deportista')
      }

      await this.cache.delete('all_athletes')

      return {
        success: true,
        message: 'Deportista registrado correctamente',
        data: signupData.user,
        credentials: {
          email: data.email,
          password: password
        }
      }
    } catch (error) {
      Logger.error(`Failed to create athlete: ${error.message}`)
      throw new BadRequestException('Error al crear el atleta')
    }
  }

  async updateAthlete(id: string, dto: any): Promise<any> {
    try {
      Logger.log(`Updating athlete ${id} with data: ${JSON.stringify(dto)}`)

      const updateData: any = {}

      if (dto.first_name !== undefined) updateData.first_name = dto.first_name
      if (dto.paternal_last_name !== undefined)
        updateData.paternal_last_name = dto.paternal_last_name
      if (dto.maternal_last_name !== undefined)
        updateData.maternal_last_name = dto.maternal_last_name
      if (dto.birth_date !== undefined) updateData.birth_date = dto.birth_date
      if (dto.dni !== undefined) updateData.dni = dto.dni
      if (dto.phone !== undefined) updateData.phone = dto.phone
      if (dto.email !== undefined) updateData.email = dto.email
      if (dto.avatar_url !== undefined) updateData.avatar_url = dto.avatar_url
      updateData.last_profile_update = new Date().toISOString()

      const { error: profileError } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .update(updateData)
        .eq('id', id)

      if (profileError) {
        Logger.error(`Error updating profile: ${profileError.message}`)
        throw new BadRequestException(
          'Error al actualizar el perfil del atleta'
        )
      }

      if (
        dto.level !== undefined ||
        dto.height !== undefined ||
        dto.weight !== undefined
      ) {
        const athleteUpdateData: any = {}
        if (dto.level !== undefined) athleteUpdateData.level = dto.level
        if (dto.height !== undefined) athleteUpdateData.height = dto.height
        if (dto.weight !== undefined) athleteUpdateData.weight = dto.weight

        const { error: athleteError } = await this.supabaseClient
          .schema('users')
          .from('athletes')
          .update(athleteUpdateData)
          .eq('athlete_id', id)

        if (athleteError) {
          Logger.error(`Error updating athlete: ${athleteError.message}`)
          throw new BadRequestException(
            'Error al actualizar los datos del atleta'
          )
        }
      }

      await this.cache.delete(`athlete_${id}`)
      await this.cache.delete('all_athletes')

      return {
        success: true,
        message: 'Atleta actualizado correctamente'
      }
    } catch (error) {
      Logger.error(`Failed to update athlete: ${error.message}`)
      throw new BadRequestException('Error al actualizar el atleta')
    }
  }

  async deleteAthlete(id: string): Promise<any> {
    try {
      Logger.log(`Deleting athlete ${id}`)

      const { error: deleteError } =
        await this.supabaseClient.auth.admin.deleteUser(id)

      if (deleteError) {
        Logger.error(`Error deleting auth user: ${deleteError.message}`)
        throw new BadRequestException('Error al eliminar el deportista')
      }

      await this.cache.delete(`athlete_${id}`)
      await this.cache.delete('all_athletes')

      return {
        success: true,
        message: 'Deportista eliminado correctamente'
      }
    } catch (error) {
      Logger.error(`Failed to delete athlete: ${error.message}`)
      throw new BadRequestException('Error al eliminar el atleta')
    }
  }
}
