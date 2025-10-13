import { User } from './user.entity'
import { SignupUserDto } from '../dto/signup-user.dto'
import type { Database } from '../user.database.types'
import { User as ProtoUser } from '@common/proto/types/apps/common/proto/user'
type UserProfile = Database['users']['Tables']['profiles']['Row']
type UserInsert = Database['users']['Tables']['profiles']['Insert']

export class UserMapper {
  static fromDto(dto: SignupUserDto): User {
    return new User(
      dto.id,
      dto.email,
      dto.dni,
      dto.firstName,
      dto.paternalLastName,
      dto.maternalLastName,
      dto.phone,
      dto.role,
      dto.birthdate,
      dto.avatar
    )
  }

  static fromDatabase(row: UserProfile): User {
    return new User(
      row.id,
      row.email,
      row.dni,
      row.first_name,
      row.paternal_last_name,
      row.maternal_last_name,
      row.phone,
      row.role,
      row.birth_date,
      row.avatar_url ?? undefined,
      row.last_avatar_change
    )
  }

  static toDatabase(user: User): UserInsert {
    return {
      id: user.id,
      email: user.email,
      dni: user.dni,
      first_name: user.firstName,
      paternal_last_name: user.paternalLastName,
      maternal_last_name: user.maternalLastName,
      phone: user.phone,
      role: user.role,
      birth_date: user.birthdate,
      avatar_url: user.avatar,
      created_at: new Date().toISOString()
    }
  }
  static fromProto(user: ProtoUser): User {
    return new User(
      user.id,
      user.email,
      user.dni,
      user.firstName,
      user.paternalLastName,
      user.maternalLastName,
      user.phone,
      user.role,
      user.birthdate,
      user.avatar,
      null,
      user.metadata!
    )
  }
}
