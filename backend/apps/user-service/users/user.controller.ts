import { Controller } from '@nestjs/common'
import { UserCases } from './user.cases'
import { MessagePattern } from '@nestjs/microservices'

@Controller('users')
export class UserController {
  private readonly userCases: UserCases
  constructor(userCases: UserCases) {
    this.userCases = userCases
  }
  @MessagePattern('get_user_by_id')
  async getProfile(userId: string) {
    return this.userCases.getUserById(userId)
  }
}
