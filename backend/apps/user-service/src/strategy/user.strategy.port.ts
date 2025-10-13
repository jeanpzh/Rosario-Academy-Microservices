import { User } from '../users/user.entity'

export abstract class UserStrategy {
  abstract registerUser(
    userData: User,
    metadata: { [key: string]: any }
  ): Promise<void>
}
