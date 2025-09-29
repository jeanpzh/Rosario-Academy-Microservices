import { UserRepository } from './user.boundarie'

export class UserCases {
  private readonly userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }
  async getUserById(id: string) {
    return this.userRepository.findById(id)
  }
}
