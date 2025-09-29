import { SupabaseClient, UserMetadata } from '@supabase/supabase-js'
import { UserRepository } from './user.boundarie'
import { User } from './user.domain'
import { Database } from './user.database.types'
import { Logger } from '@nestjs/common'

export class UserRepositoryImpl implements UserRepository {
  private supabaseClient: SupabaseClient<Database>
  private logger: Logger
  constructor(supabaseClient, logger: Logger) {
    this.supabaseClient = supabaseClient
    this.logger = logger
  }
  async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabaseClient
        .schema('users')
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        throw new Error(`Error fetching profile: ${error.message}`)
      }
      const userData: User = new User(
        data.id,
        data.email,
        data.dni,
        data.first_name,
        data.paternal_last_name,
        data.maternal_last_name,
        data.phone,
        data.role,
        data.birth_date,
        data.avatar_url ?? undefined
        data.last_avatar_change
      )

      return userData
    } catch (error) {
      this.logger.error(`findById failed for id ${id}: ${error.message}`)
      throw new Error(`Error in findById: ${error.message}`)
    }
  }
  async save(user: User): Promise<void> {
    const { error: rpcError } = await this.supabaseClient.rpc(
      'process_new_user',
      {
        p_id: user._id,
        p_email: user.email,
        p_raw_user_metadata: {
          first_name: user.firstName,
          paternal_last_name: user.paternalLastName,
          maternal_last_name: user.maternalLastName,
          birth_date: user.birthdate,
          avatar_url: user.avatar,
          phone: user.phone,
          dni: user.dni,
          role: user.role
        }
      }
    )

    if (rpcError) {
      throw new Error(`Error en RPC process_new_user: ${rpcError.message}`)
    }
  }
  async update(userId: string): Promise<void> {
    const user = await this.findById(userId)
  }
}
