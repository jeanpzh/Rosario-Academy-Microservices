import { User as UserEntity } from './user.entity'

export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>
  abstract save(user: UserEntity): Promise<void>
  abstract update(
    id: string,
    user: Partial<UserEntity>
  ): Promise<UserEntity | null>
  abstract changeAvatar(
    id: string,
    avatarUrl: string
  ): Promise<{ avatarUrl: string }>
  abstract getShifts(): Promise<any>
  abstract verifyDNI(dni: string): Promise<boolean>
  abstract verifyEmail(email: string): Promise<boolean>
}
