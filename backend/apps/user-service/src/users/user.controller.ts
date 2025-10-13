import { Controller, Logger } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { UserRepository } from './user.port'
import { UpdateProfileDto } from '../dto/update-profile.dto'

@Controller()
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @MessagePattern('get_user_by_id')
  async getProfile(userId: string) {
    return this.userRepository.findById(userId)
  }
  @MessagePattern('update_user')
  async updateUser(data: { userId: string; dto: UpdateProfileDto }) {
    return this.userRepository.update(data.userId, data.dto)
  }
  @MessagePattern('change_avatar')
  async changeAvatar(data: { userId: string; avatarUrl: string }) {
    const result = await this.userRepository.changeAvatar(
      data.userId,
      data.avatarUrl
    )
    return result
  }
  @MessagePattern('get_shifts')
  async getShifts() {
    return this.userRepository.getShifts()
  }
}
