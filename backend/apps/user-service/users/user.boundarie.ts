import { User } from './user.domain'

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>
  abstract save(user: User): Promise<void>
  abstract update(user: User): Promise<void>
}
