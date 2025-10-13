import {
  Inject,
  Injectable,
  Logger,
  Res,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Response } from 'express'
import { firstValueFrom, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { CookieService } from './gateway.cookie.service'
import { SignInDto } from '../dto/signin.dto'
import { SignUpDto } from '../dto/signup.dto'
import {
  AuthSignInResponseDto,
  AuthSignUpResponseDto,
  AuthSignOutResponseDto
} from '../dto/auth-response.dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import {
  ResetPasswordRequestDto,
  ResetPasswordResponseDto
} from '../dto/reset-password.dto'

import { GatewayTimeoutException } from '@nestjs/common'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly cookieService: CookieService
  ) {}

  private async sendToAuthService<T>(
    pattern: string,
    data: any,
    timeoutMs = 5000
  ): Promise<T> {
    return firstValueFrom(
      this.authClient.send<T>(pattern, data).pipe(
        timeout(timeoutMs),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            this.logger.error(`Auth service timeout on pattern: ${pattern}`)
            return throwError(
              () =>
                new GatewayTimeoutException(
                  'El servicio de autenticación no responde.'
                )
            )
          }
          return throwError(() => err)
        })
      )
    )
  }

  async verifyConnection(body: {
    message: string
  }): Promise<{ message: string }> {
    return this.sendToAuthService('verify', body)
  }

  async signIn(
    signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthSignInResponseDto> {
    const result = await this.sendToAuthService<{
      user: any
      access_token: string
      refresh_token: string
    }>('signin', signInDto, 10000)

    const { user, access_token, refresh_token } = result
    this.cookieService.setAuthCookies(response, access_token)
    this.cookieService.setRefreshTokenCookie(response, refresh_token)

    return new AuthSignInResponseDto(user)
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthSignUpResponseDto> {
    const result = await this.sendToAuthService<{
      success: boolean
      message: string
      user: any
    }>('signup', signUpDto, 15000)
    return new AuthSignUpResponseDto(
      result.success !== false,
      result.message,
      result.user
    )
  }

  async signOut(jwt: string): Promise<AuthSignOutResponseDto> {
    // La validación de negocio se queda en el servicio.
    if (!jwt) {
      throw new UnauthorizedException('No se encontró sesión activa')
    }
    await this.sendToAuthService('signout', jwt)
    return new AuthSignOutResponseDto()
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<{ success: boolean; message: string }> {
    if (!id) {
      throw new BadRequestException('ID de usuario requerido')
    }
    return this.sendToAuthService(
      'change-password',
      { id, ...changePasswordDto },
      10000
    )
  }

  async resetPasswordRequest(
    resetPasswordDto: ResetPasswordRequestDto
  ): Promise<ResetPasswordResponseDto> {
    const result = await this.sendToAuthService<{
      success: boolean
      message: string
    }>('reset-password-request', resetPasswordDto, 10000)
    return new ResetPasswordResponseDto(result.success, result.message)
  }
}
