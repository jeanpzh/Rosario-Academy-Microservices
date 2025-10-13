import { Injectable } from '@nestjs/common'
import { UserStrategy } from './user.strategy.port'
import { UserRole } from '@common/enums/user-roles.enum'
import { UserRepository } from '../users/user.port'
import { AthleteRegisterStrategy } from './athlete.register.strategy'
import { AdminRegisterStrategy } from './admin.register.strategy'
import { AssistantRegisterStrategy } from './assistant.register.strategy'
import { User } from '../users/user.entity'

@Injectable()
export class UserRegisterStrategy implements UserStrategy {
  private readonly strategies: Map<UserRole, UserStrategy>
  constructor(
    private readonly athleteStrategy: AthleteRegisterStrategy,
    private readonly adminStrategy: AdminRegisterStrategy,
    private readonly auxiliarStrategy: AssistantRegisterStrategy,
    private readonly userRepository: UserRepository
  ) {
    this.strategies = new Map<UserRole, UserStrategy>([
      [UserRole.ATHLETE, this.athleteStrategy],
      [UserRole.ADMIN, this.adminStrategy],
      [UserRole.AUXILIAR, this.auxiliarStrategy]
    ])
  }

  async registerUser(
    userData: User,
    metadata: { [key: string]: any }
  ): Promise<void> {
    await this.userRepository.save(userData)

    const strategy = this.strategies.get(userData.role as UserRole)
    if (!strategy) {
      throw new Error(`No strategy found for role: ${userData.role}`)
    }
    return await strategy.registerUser(userData, metadata)
  }
}
