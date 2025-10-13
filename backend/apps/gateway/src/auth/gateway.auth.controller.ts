import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  ForbiddenException
} from '@nestjs/common'
import { Response } from 'express'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam
} from '@nestjs/swagger'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthService } from './gateway.auth.service'
import { Public, Roles } from '@common/decorators'
import { SignInDto } from '../dto/signin.dto'
import { SignUpDto } from '../dto/signup.dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import {
  AuthSignInResponseDto,
  AuthSignUpResponseDto,
  AuthSignOutResponseDto,
  ChangePasswordResponseDto
} from '../dto/auth-response.dto'
import {
  ResetPasswordRequestDto,
  ResetPasswordResponseDto
} from '../dto/reset-password.dto'
import { RolesGuard } from './guards/roles.guard'
import { UserRole } from '@common/enums/user-roles.enum'

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User sign in',
    description: 'Authenticate user and set session cookie'
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
    type: AuthSignInResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials'
  })
  async signIn(
    @Body() signInDto: any,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthSignInResponseDto> {
    this.logger.log(
      `Sign in attempt for email: ${signInDto.email} ${signInDto.password}`
    )
    return await this.authService.signIn(signInDto, response)
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User sign out',
    description: 'Sign out user and invalidate session'
  })
  @ApiCookieAuth('auth_session')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed out',
    type: AuthSignOutResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated'
  })
  async signOut(@Request() req): Promise<AuthSignOutResponseDto> {
    const jwt = req.cookies?.auth_session
    this.logger.log(`Sign out request for user: ${req.user?.sub}`)
    return await this.authService.signOut(jwt)
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User sign up',
    description: 'Register a new user account'
  })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthSignUpResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists'
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthSignUpResponseDto> {
    this.logger.log(`Sign up attempt for email: ${signUpDto.email}`)
    return await this.authService.signUp(signUpDto)
  }

  @Post(':id/change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ATHLETE, UserRole.AUXILIAR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description: 'Change authenticated user password'
  })
  @ApiCookieAuth('auth_session')
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password successfully changed',
    type: ChangePasswordResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No permission to change this password'
  })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req
  ): Promise<ChangePasswordResponseDto> {
    // Validar que el usuario solo pueda cambiar su propia contraseña
    Logger.log(JSON.stringify(req.user), 'req.user', id)
    const sub = req.user?.sub ?? req.user?.userId
    if (sub !== id) {
      this.logger.warn(
        `User ${sub} attempted to change password for user ${id}`
      )
      throw new ForbiddenException(
        'No tienes permiso para cambiar esta contraseña'
      )
    }

    this.logger.log(`Password change request for user: ${id}`)
    const result = await this.authService.changePassword(id, changePasswordDto)
    return new ChangePasswordResponseDto(result.success, result.message)
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password request',
    description: 'Request password reset via email'
  })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
    type: ResetPasswordResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email'
  })
  async resetPasswordRequest(
    @Body() resetPasswordDto: ResetPasswordRequestDto
  ): Promise<ResetPasswordResponseDto> {
    this.logger.log(
      `Password reset request for email: ${resetPasswordDto.email}`
    )
    return await this.authService.resetPasswordRequest(resetPasswordDto)
  }
}
