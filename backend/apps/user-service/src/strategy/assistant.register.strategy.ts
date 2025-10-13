import { Injectable } from '@nestjs/common'
import { UserStrategy } from './user.strategy.port'

@Injectable()
export class AssistantRegisterStrategy implements UserStrategy {
  constructor() {}
  async registerUser(): Promise<void> {
    // TODO : Implementar lógica de registro para auxiliares administrativos
    console.log('Registrando auxiliar administrativo...')
  }
}
