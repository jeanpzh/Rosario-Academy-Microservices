import { SupabaseClient } from '@supabase/supabase-js'
import {
  Assistant,
  Athlete,
  AthleteLevel,
  AthletePaymentSummary,
  CreateAssistantDto,
  CreateAssistantResponse,
  EnrollmentStatus,
  OperationResponse,
  UpdateAssistantDto,
  WorkerRepository
} from './worker.repository'
import { Database } from '../user.database.types'
import { Injectable, Logger } from '@nestjs/common'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { randomBytes } from 'crypto'
import { DatabaseOperationError, WorkerErrorHandler } from './worker.errors'

@Injectable()
export class WorkerRepositoryImpl implements WorkerRepository {
  constructor(
    private readonly supabaseClient: SupabaseClient<Database>,
    private readonly cache: CacheBoundarie
  ) {}

  async findAllAssistants(): Promise<Assistant[]> {
    const cacheKey = 'all_assistants'

    try {
      // Check cache first
      const cachedAssistants = await this.cache.get<Assistant[]>(cacheKey)
      if (cachedAssistants) {
        Logger.log('Returning cached assistants')
        return cachedAssistants
      }

      // Query database
      const { data: assistants, error } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .select(
          `
          id,
          email,
          dni,
          first_name,
          maternal_last_name,
          paternal_last_name,
          phone,
          avatar_url,
          birth_date,
          created_at,
          updated_at
          `
        )
        .eq('role', 'auxiliar_administrativo')

      if (error) {
        throw new DatabaseOperationError('findAllAssistants', error.message)
      }

      if (!assistants) {
        Logger.warn('No assistants found in database')
        return []
      }

      // Cache the result
      await this.cache.set(cacheKey, assistants, 300)
      Logger.log(`Retrieved ${assistants.length} assistants from database`)

      return assistants
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'findAllAssistants')
    }
  }
  async findAllAthletes(): Promise<Athlete[]> {
    const cacheKey = 'all_athletes'

    try {
      // Check cache first
      const cachedAthletes = await this.cache.get<Athlete[]>(cacheKey)
      if (cachedAthletes) {
        Logger.log('Returning cached athletes')
        return cachedAthletes
      }

      // Query database using RPC function
      const { data: athletes, error } = await this.supabaseClient
        .schema('users')
        .rpc('get_athletes')

      if (error) {
        throw new DatabaseOperationError('findAllAthletes', error.message)
      }

      if (!athletes) {
        Logger.warn('No athletes found in database')
        return []
      }

      // Cache the result
      await this.cache.set(cacheKey, athletes, 300)
      Logger.log(`Retrieved ${athletes.length} athletes from database`)

      return athletes
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'findAllAthletes')
    }
  }
  async getAthleteLevels(): Promise<{ level: AthleteLevel }[]> {
    try {
      const { data: athletesLevels, error } = await this.supabaseClient
        .schema('users')
        .from('athletes')
        .select('level')

      if (error) {
        throw new DatabaseOperationError('getAthleteLevels', error.message)
      }

      if (!athletesLevels) {
        Logger.warn('No athlete levels found')
        return []
      }

      Logger.log(`Retrieved ${athletesLevels.length} athlete levels`)
      return athletesLevels
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'getAthleteLevels')
    }
  }

  async updateAthleteStatus(
    id: string,
    status: EnrollmentStatus
  ): Promise<OperationResponse> {
    try {
      Logger.log(`Updating athlete ${id} status to ${status}`)

      const { error } = await this.supabaseClient
        .schema('users')
        .from('enrollment_requests')
        .update({ status })
        .eq('athlete_id', id)

      if (error) {
        throw new DatabaseOperationError('updateAthleteStatus', error.message)
      }

      // Invalidate relevant cache entries
      await Promise.all([
        this.cache.delete('all_athletes'),
        this.cache.delete(`athlete_${id}`)
      ])

      Logger.log(`Successfully updated status for athlete ${id}`)

      return {
        success: true,
        message: 'Estado del atleta actualizado correctamente'
      }
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'updateAthleteStatus')
    }
  }

  async updateAthleteLevel(
    id: string,
    level: AthleteLevel
  ): Promise<OperationResponse> {
    try {
      Logger.log(`Updating athlete ${id} level to ${level}`)

      const { error } = await this.supabaseClient
        .schema('users')
        .from('athletes')
        .update({ level })
        .eq('athlete_id', id)

      if (error) {
        throw new DatabaseOperationError('updateAthleteLevel', error.message)
      }

      // Invalidate relevant cache entries
      await Promise.all([
        this.cache.delete('all_athletes'),
        this.cache.delete(`athlete_${id}`)
      ])

      Logger.log(`Successfully updated level for athlete ${id}`)

      return {
        success: true,
        message: 'Nivel del atleta actualizado correctamente'
      }
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'updateAthleteLevel')
    }
  }

  async createAssistant(
    data: CreateAssistantDto
  ): Promise<CreateAssistantResponse> {
    try {
      Logger.log(`Creating assistant with email: ${data.email}`)

      // Generate secure random password
      const password = randomBytes(16).toString('hex')

      // Create auth user
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
            role: 'auxiliar_administrativo',
            avatar_url: null,
            phone: data.phone
          }
        })

      if (signupError) {
        throw new DatabaseOperationError(
          'createAssistant - auth user creation',
          signupError.message
        )
      }

      if (!signupData.user) {
        throw new DatabaseOperationError(
          'createAssistant',
          'Auth user created but no user data returned'
        )
      }

      // Create profile
      const { error: profileError } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .insert({
          id: signupData.user.id,
          first_name: data.first_name,
          paternal_last_name: data.paternal_last_name,
          maternal_last_name: data.maternal_last_name,
          birth_date: data.birth_date,
          dni: data.dni,
          role: 'auxiliar_administrativo',
          avatar_url: null,
          phone: data.phone,
          email: data.email
        })

      if (profileError) {
        // Rollback: delete auth user if profile creation fails
        await this.supabaseClient.auth.admin.deleteUser(signupData.user.id)
        throw new DatabaseOperationError(
          'createAssistant - profile creation',
          profileError.message
        )
      }

      // Create employee record
      const { error: employeeError } = await this.supabaseClient
        .schema('users')
        .from('employees')
        .insert({
          employee_id: signupData.user.id
        })

      if (employeeError) {
        // Rollback: delete auth user if employee creation fails
        await this.supabaseClient.auth.admin.deleteUser(signupData.user.id)
        throw new DatabaseOperationError(
          'createAssistant - employee creation',
          employeeError.message
        )
      }

      // Invalidate cache
      await this.cache.delete('all_assistants')

      Logger.log(
        `Successfully created assistant with ID: ${signupData.user.id}`
      )

      return {
        success: true,
        message: 'Auxiliar registrado correctamente',
        data: { email: data.email, password }
      }
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'createAssistant')
    }
  }

  async updateAssistant(
    id: string,
    dto: UpdateAssistantDto
  ): Promise<OperationResponse> {
    try {
      Logger.log(`Updating assistant ${id}`)

      // Build update object dynamically (only include provided fields)
      const updateData: Partial<UpdateAssistantDto> & {
        last_profile_update: string
      } = {
        last_profile_update: new Date().toISOString()
      }

      if (dto.first_name !== undefined) updateData.first_name = dto.first_name
      if (dto.paternal_last_name !== undefined)
        updateData.paternal_last_name = dto.paternal_last_name
      if (dto.maternal_last_name !== undefined)
        updateData.maternal_last_name = dto.maternal_last_name
      if (dto.birth_date !== undefined) updateData.birth_date = dto.birth_date
      if (dto.dni !== undefined) updateData.dni = dto.dni
      if (dto.phone !== undefined) updateData.phone = dto.phone
      if (dto.email !== undefined) updateData.email = dto.email

      const { error } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .update(updateData)
        .eq('id', id)

      if (error) {
        throw new DatabaseOperationError('updateAssistant', error.message)
      }

      // Invalidate relevant cache entries
      await Promise.all([
        this.cache.delete(`assistant_${id}`),
        this.cache.delete('all_assistants')
      ])

      Logger.log(`Successfully updated assistant ${id}`)

      return {
        success: true,
        message: 'Auxiliar actualizado correctamente'
      }
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'updateAssistant')
    }
  }

  async deleteAssistant(id: string): Promise<OperationResponse> {
    try {
      Logger.log(`Deleting assistant ${id}`)

      // Supabase auth admin will cascade delete profile and employee records
      const { error } = await this.supabaseClient.auth.admin.deleteUser(id)

      if (error) {
        throw new DatabaseOperationError('deleteAssistant', error.message)
      }

      // Invalidate relevant cache entries
      await Promise.all([
        this.cache.delete(`assistant_${id}`),
        this.cache.delete('all_assistants')
      ])

      Logger.log(`Successfully deleted assistant ${id}`)

      return {
        success: true,
        message: 'Auxiliar eliminado correctamente'
      }
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'deleteAssistant')
    }
  }
  async getAthletesWithPayments(): Promise<AthletePaymentSummary[]> {
    const cacheKey = 'athletes_with_payments'

    try {
      // Check cache first
      const cachedData = await this.cache.get<AthletePaymentSummary[]>(cacheKey)
      if (cachedData) {
        Logger.log('Returning cached athletes with payments')
        return cachedData
      }

      // Query the view (ordered by first name for consistency)
      const { data: athletes, error } = await this.supabaseClient
        .schema('users')
        .from('vw_athlete_payments_summary')
        .select('*')
        .order('first_name', { ascending: true, nullsFirst: false })

      if (error) {
        throw new DatabaseOperationError(
          'getAthletesWithPayments',
          error.message
        )
      }

      if (!athletes) {
        Logger.warn('No athletes with payments found')
        return []
      }

      // Cache the result
      await this.cache.set(cacheKey, athletes, 300)
      Logger.log(`Retrieved ${athletes.length} athletes with payment summaries`)

      return athletes
    } catch (error) {
      WorkerErrorHandler.handleRepositoryError(error, 'getAthletesWithPayments')
    }
  }
}
