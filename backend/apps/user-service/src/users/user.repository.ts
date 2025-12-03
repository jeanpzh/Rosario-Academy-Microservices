import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../user.database.types'
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { UserMapper } from './user.mapper'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { User } from './user.entity'
import { UserRepository } from './user.port'
import { SUPABASE_CLIENT } from '@common/supabase/supabase.provider'

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly cache: CacheBoundarie,
    private readonly logger: Logger,
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient<Database>
  ) {}
  async findById(id: string): Promise<User | null> {
    const cachedUser = await this.cache.get<User>(`userProfile:${id}`)
    if (cachedUser) {
      this.logger.log(`Cache hit for user ${id}`)
      return cachedUser
    }
    this.logger.log(`Cache miss for user ${id}, querying database`)

    const { data, error } = await this.supabaseClient
      .schema('users')
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null

    await this.cache.set(
      `userProfile:${id}`,
      UserMapper.fromDatabase(data),
      3600
    )
    return UserMapper.fromDatabase(data)
  }
  async save(user: User): Promise<void> {
    const dbUser = UserMapper.toDatabase(user)
    const { error } = await this.supabaseClient
      .schema('users')
      .from('profiles')
      .insert(dbUser)
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating profile: ${error.message}`)
    }
  }
  async update(userId: string, toUpdate: Partial<User>): Promise<User | null> {
    try {
      const user = await this.findById(userId)
      if (!user) throw new NotFoundException('Usuario no encontrado')

      const { data, error: updateError } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .update({
          first_name: toUpdate.firstName,
          maternal_last_name: toUpdate.maternalLastName,
          paternal_last_name: toUpdate.paternalLastName,
          phone: toUpdate.phone
        })
        .eq('id', userId)
        .select('*')
        .single()

      if (updateError) {
        throw new Error(`Error updating profile: ${updateError.message}`)
      }

      const updatedUser = UserMapper.fromDatabase(data)

      // Invalidar la caché anterior
      await this.cache.delete(`userProfile:${userId}`)

      await this.cache.set(`userProfile:${userId}`, updatedUser, 3600)

      this.logger.log(
        `User ${userId} updated successfully and cache invalidated`
      )

      return updatedUser
    } catch (error) {
      this.logger.error(`update failed for user ${userId}: ${error.message}`)
      throw error
    }
  }
  async changeAvatar(
    userId: string,
    avatarUrl: string
  ): Promise<{ avatarUrl: string }> {
    try {
      this.logger.log(
        `[changeAvatar] Starting avatar change for user ${userId}`
      )
      this.logger.log(`[changeAvatar] New avatar URL: ${avatarUrl}`)

      const user = await this.findById(userId)
      if (!user) throw new NotFoundException('Usuario no encontrado')

      this.logger.log(`[changeAvatar] User found, proceeding with update`)

      const now = new Date().toISOString()

      const { data, error: updateError } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .update({
          avatar_url: avatarUrl,
          last_avatar_change: now
        })
        .eq('id', userId)
        .select('avatar_url')
        .single()

      if (updateError) {
        this.logger.error(`Error updating avatar: ${updateError.message}`)
        throw new BadRequestException('Error al actualizar el avatar')
      }

      // Invalidar la caché del usuario
      await this.cache.delete(`userProfile:${userId}`)

      this.logger.log(`Avatar updated successfully for user ${userId}`)

      return { avatarUrl: data.avatar_url! }
    } catch (error) {
      this.logger.error(
        `changeAvatar failed for user ${userId}: ${error.message}`
      )
      throw error
    }
  }

  async getShifts(): Promise<any> {
    try {
      const { data: shiftDetails, error: shiftError } =
        await this.supabaseClient
          .schema('users')
          .from('schedules')
          .select(
            `
          schedule_name,
          schedule_id,
          level,
          start_time,
          end_time,
          available_spot,
          plan_id,
          shifts:shifts!inner(weekday, schedule_id)
          `
          )
          .order('schedule_id')

      if (shiftError || !shiftDetails) {
        console.log(shiftError)
        throw new BadRequestException('Error al obtener los turnos')
      }
      const shiftsMapped = shiftDetails.map((s) => ({
        id: s.level,
        name: s.schedule_name,
        description: `${s.start_time} - ${s.end_time} (${(s.shifts ?? []).map((x) => x.weekday).join(', ')})`,
        spots: s.available_spot,
        planId: s.plan_id
      }))
      return shiftsMapped
    } catch (error) {
      Logger.error(error)
      throw new BadRequestException('Error al obtener los turnos')
    }
  }
  async verifyDNI(dni: string): Promise<boolean> {
    const { error } = await this.supabaseClient
      .schema('users')
      .from('profiles')
      .select('dni')
      .eq('dni', dni)
      .single()
    if (error) {
      if (error.code === 'PGRST116') {
        return false
      }
    }
    return true
  }
  async verifyEmail(email: string): Promise<boolean> {
    const { error } = await this.supabaseClient
      .schema('users')
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()
    if (error) {
      if (error.code === 'PGRST116') {
        return false
      }
    }
    return true
  }
}
