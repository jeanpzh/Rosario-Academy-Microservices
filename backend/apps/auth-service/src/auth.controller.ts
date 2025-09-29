import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
  Param
} from '@nestjs/common'
import { Response } from 'express'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AuthService } from './auth.service'
import {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from './dto/auth.dto'
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard'
import { Roles } from '@common/decorators/roles.decorator'
import { UserRole } from '@common/enums/user-roles.enum'
import { Public } from '@common/decorators/roles.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @MessagePattern('verify_connection')
  async verifyConnectionMicroservice(@Payload() data: any) {
    if (!data) return { message: 'No data received' }
    return { message: 'Auth Service connection successful: ', data }
  }

  @Public()
  @MessagePattern('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signUp(signUpDto, res)
  }

  @Public()
  @MessagePattern('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.signIn(signInDto)

    // Establecer cookies HttpOnly seguras
    res.cookie('auth_session', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hora en milisegundos
      path: '/'
    })

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 días en milisegundos
      path: '/'
    })

    return {
      user: result.user,
      message: 'Autenticación exitosa'
    }
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }
  @Public()
  @MessagePattern('signout')
  async signOut(@Request() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signOut(req, res)
  }
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.sub
    const user = await this.authService.getUserProfile(userId)
    return {
      user,
      message: 'Perfil obtenido exitosamente'
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get('admin-only')
  async adminOnly() {
    return { message: 'Endpoint solo para administradores' }
  }

  @Public()
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString()
    }
  }

  // ========== PATRONES DE MICROSERVICIO PARA COMUNICACIÓN INTERNA ==========

  @Public()
  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() data: { token: string }) {
    try {
      // Este método sería implementado para validar tokens desde otros servicios
      // Por ahora retornamos éxito
      return { valid: true, user: null }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  @Public()
  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(@Payload() data: { userId: string }) {
    try {
      const user = await this.authService.getUserProfile(data.userId)
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Public()
  @MessagePattern({ cmd: 'check_user_role' })
  async checkUserRole(
    @Payload() data: { userId: string; requiredRole: UserRole }
  ) {
    try {
      const user = await this.authService.getUserProfile(data.userId)
      const hasRole =
        user.user_metadata.role === data.requiredRole ||
        user.user_metadata.role === UserRole.ADMIN

      return { success: true, hasRole, userRole: user.user_metadata.role }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseGuards(JwtAuthGuard)
  @Post('profile/:id/change-password')
  async changePassword(
    @Body() body: { currentPassword: string; newPassword: string },
    @Param('id') id: string
  ) {
    return this.authService.changePassword({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
      id: id
    })
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseGuards(JwtAuthGuard)
  @Post('/send-password-reset-email')
  async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }
}
