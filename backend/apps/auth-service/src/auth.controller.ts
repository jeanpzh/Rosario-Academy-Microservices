import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { SignInDto, RefreshTokenDto, ForgotPasswordDto } from './dto/auth.dto'
import { UserRole } from '@common/enums/user-roles.enum'
import { AuthService } from './auth.service'
import { SignUpDto } from 'apps/gateway/src/dto/signup.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signin')
  async signIn(@Payload() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto)
  }

  @MessagePattern('signup')
  async signUp(@Payload() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto)
  }

  @MessagePattern('signout')
  async signOut(@Payload() jwt: string) {
    return await this.authService.signOut(jwt)
  }

  @MessagePattern('refresh_token')
  async refreshToken(@Payload() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto)
  }

  @MessagePattern('get_user_by_id')
  async getUserById(@Payload() data: { userId: string }) {
    return await this.authService.getUserProfile(data.userId)
  }

  @MessagePattern('check_user_role')
  async checkUserRole(
    @Payload() data: { userId: string; requiredRole: UserRole }
  ) {
    try {
      const user = await this.authService.getUserProfile(data.userId)
      return { success: true, userRole: user.user_metadata.role }
    } catch (error) {
      this.logger.error(
        `Check user role error for ${data.userId}: ${error.message}`,
        error.stack
      )
      throw error
    }
  }

  @MessagePattern('change-password')
  async changePassword(
    @Payload()
    data: {
      id: string
      currentPassword: string
      newPassword: string
    }
  ): Promise<{ success: boolean; message: string }> {
    const { id, currentPassword, newPassword } = data
    return await this.authService.changePassword({
      currentPassword,
      newPassword,
      id
    })
  }

  @MessagePattern('reset-password-request')
  async resetPasswordRequest(
    @Payload() forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.authService.forgotPassword(forgotPasswordDto)
    return {
      success: true,
      message: result.message
    }
  }
}
