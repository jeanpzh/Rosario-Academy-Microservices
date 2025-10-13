import type { Database } from '../user.database.types'
import { User } from './user.entity'
type UserProfile = Database['users']['Tables']['profiles']['Row']

export const formatUser = (user: UserProfile): User => {
  return new User(
    user.id,
    user.email,
    user.dni,
    user.first_name,
    user.paternal_last_name,
    user.maternal_last_name,
    user.phone,
    user.role,
    user.birth_date,
    user.avatar_url ?? undefined,
    user.last_avatar_change
  )
}
