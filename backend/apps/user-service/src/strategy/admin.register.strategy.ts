import { Injectable } from '@nestjs/common'
import { UserStrategy } from './user.strategy.port'

@Injectable()
export class AdminRegisterStrategy implements UserStrategy {
  constructor() {}
  async registerUser(userData: any): Promise<any> {
    await 'this.adminRepository.save(userData)'
  }
}
