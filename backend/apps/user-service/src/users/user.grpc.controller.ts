import { Controller, Logger } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  SaveUserRequest,
  SaveUserResponse,
  VerifyDNIRequest,
  VerifyDNIResponse
} from '@common/proto/types/apps/common/proto/user'
import { UserStrategy } from '../strategy/user.strategy.port'
import { UserRepository } from './user.port'
import { Struct } from '@common/proto/types/google/protobuf/struct'
import { UserMapper } from './user.mapper'
@Controller()
export class UserGrpcController {
  private readonly logger = new Logger(UserGrpcController.name)

  constructor(
    private readonly userRegisterStrategy: UserStrategy,
    private readonly userRepository: UserRepository
  ) {}

  @GrpcMethod('UserService', 'SaveUser')
  async saveUser({ user }: SaveUserRequest): Promise<SaveUserResponse> {
    if (!user) {
      throw new Error('User data is required')
    }
    const metadata = Struct.unwrap(user.metadata)
    try {
      const userEntity = UserMapper.fromProto(user)
      await this.userRegisterStrategy.registerUser(userEntity, metadata)

      return {
        success: true,
        message: 'Usuario guardado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          dni: user.dni,
          firstName: user.firstName,
          paternalLastName: user.paternalLastName,
          maternalLastName: user.maternalLastName,
          phone: user.phone,
          role: user.role,
          birthdate: user.birthdate,
          avatar: user.avatar,
          metadata: Struct.wrap(metadata)
        }
      }
    } catch (error) {
      this.logger.error(`Error saving user: ${error.message}`)
      throw error
    }
  }
  @GrpcMethod('UserService', 'VerifyDNI')
  async verifyDNI(request: VerifyDNIRequest): Promise<VerifyDNIResponse> {
    const { dni } = request
    try {
      const isValid = await this.userRepository.verifyDNI(dni)
      return { isValid: isValid }
    } catch (error) {
      this.logger.error(`Error verifying DNI: ${error.message}`)
      throw error
    }
  }
  @GrpcMethod('UserService', 'VerifyEmail')
  async verifyEmail(request: { email: string }): Promise<{ isValid: boolean }> {
    const { email } = request
    try {
      const isValid = await this.userRepository.verifyEmail(email)
      return { isValid: isValid }
    } catch (error) {
      this.logger.error(`Error verifying Email: ${error.message}`)
      throw error
    }
  }
}
