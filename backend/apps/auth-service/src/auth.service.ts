import {
  Injectable,
  Logger,
  Inject,
  OnModuleInit,
  HttpStatus
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientGrpc } from '@nestjs/microservices'
import { UserMetadata } from '@supabase/supabase-js'
import {
  SignInDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from './dto/auth.dto'
import { User, AuthTokens, JwtPayload } from './entities/user.entity'
import { UserRole } from '@common/enums/user-roles.enum'
import {
  DniAlreadyExistsException,
  EmailAlreadyExistsException,
  UserNotFoundException,
  PasswordRecentlyChangedException,
  SamePasswordException,
  RollBackAuthUserException,
  FieldsRequiredException,
  InvalidCredentialsException,
  EmailNotConfirmedException
} from './errors'
import * as crypto from 'crypto'
import { lastValueFrom } from 'rxjs'
import {
  SaveUserResponse,
  UserServiceClient
} from '@common/proto/types/apps/common/proto/user'
import { SignUpDto } from 'apps/gateway/src/dto/signup.dto'
import { Struct } from '@common/proto/types/google/protobuf/struct'
import { AuthRepository } from './auth.repository'
import { RpcException } from '@nestjs/microservices'

interface CachedSession {
  userId: string
  email: string
  role: UserRole
  user_metadata: UserMetadata
  exp: number
  iat: number
}

@Injectable()
export class AuthService implements OnModuleInit {
  private userGrpcService: UserServiceClient

  constructor(
    @Inject('USER_PACKAGE') private userServiceClient: ClientGrpc,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private logger: Logger,
    private configService: ConfigService
  ) {}

  onModuleInit() {
    this.userGrpcService =
      this.userServiceClient.getService<UserServiceClient>('UserService')
    this.logger.log('gRPC Client initialized for UserService')
  }

  private hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .substring(0, 32)
  }

  async signUp(signUpDto: SignUpDto): Promise<{ user: User; message: string }> {
    if (!signUpDto.metadata) {
      throw new RpcException({
        message: 'Los datos adicionales del usuario son requeridos',
        statusCode: 400
      })
    }

    const {
      email,
      password,
      role,
      firstName,
      paternalLastName,
      maternalLastName,
      birthdate,
      avatar,
      dni,
      phone,
      metadata
    } = signUpDto

    const dniCheck = await lastValueFrom(
      this.userGrpcService.verifyDni({ dni })
    )

    if (dniCheck.isValid) {
      this.logger.warn(`DNI already in use: ${dni}`)
      throw new DniAlreadyExistsException(dni)
    }

    const emailCheck = await lastValueFrom(
      this.userGrpcService.verifyEmail({ email })
    )

    if (emailCheck.isValid) {
      this.logger.warn(`Email already in use: ${email}`)
      throw new EmailAlreadyExistsException(email)
    }

    const authUser = await this.authRepository.createAuthUser({
      email,
      password,
      metadata: {
        firstName,
        paternalLastName,
        maternalLastName,
        birthdate,
        dni,
        role: role as UserRole,
        avatar: avatar || '',
        phone,
        dni_verified: false
      }
    })

    this.logger.log(`Calling User Service via gRPC to save user profile...`)

    const userPayload = {
      id: authUser.id,
      email: email,
      firstName: firstName,
      paternalLastName: paternalLastName,
      maternalLastName: maternalLastName,
      birthdate: birthdate,
      dni,
      phone,
      role: role as UserRole,
      avatar: avatar!,
      metadata: Struct.wrap(metadata)
    }
    try {
      const grpcResponse = await lastValueFrom(
        this.userGrpcService.saveUser({
          user: userPayload
        })
      )

      if (!grpcResponse.success) {
        this.logger.error(
          `gRPC call to saveUser failed: ${grpcResponse.message}`
        )
        throw new Error('Error al crear perfil', {
          cause: grpcResponse.message
        })
      }

      this.logger.log(`gRPC call to saveUser succeeded for user ${authUser.id}`)
    } catch (error) {
      this.logger.log('Iniciando rollback de auth user')
      await this.rollbackAuthUser(authUser.id)
      throw new RollBackAuthUserException(error.message)
    }

    this.logger.log(
      `User profile saved successfully via gRPC for user ${authUser.id}`
    )

    const user = this.formatUser(authUser)
    await this.safeCacheUser(user.id, user)

    return {
      user,
      message:
        'Usuario registrado exitosamente. Por favor, verifica tu email para activar tu cuenta.'
    }
  }

  private async rollbackAuthUser(userId: string): Promise<void> {
    try {
      await this.authRepository.deleteAuthUserById(userId)
      this.logger.log(`Rolled back auth user ${userId} after failure`)
    } catch (deleteError) {
      this.logger.error(
        `Failed to rollback auth user ${userId}: ${deleteError.message}`
      )
    }
  }

  private async safeCacheUser(userId: string, user: User): Promise<void> {
    try {
      await this.authRepository.cacheUser(userId, user, 3600)
    } catch (cacheError) {
      this.logger.warn(`Failed to cache user ${userId}: ${cacheError.message}`)
    }
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto

    if (!email || !password) {
      throw new FieldsRequiredException('Email y contraseña son requeridos')
    }

    try {
      const authSession = await this.authRepository.authenticateWithCredentials(
        email,
        password
      )

      const userRole = authSession.user.user_metadata?.role

      const payload: JwtPayload = {
        sub: authSession.user.id,
        email: authSession.user.email!,
        role: userRole,
        iat: Math.floor(Date.now() / 1000)
      }
      const accessToken = this.jwtService.sign(payload)

      const cachedSession: CachedSession = {
        userId: authSession.user.id,
        email: authSession.user.email!,
        role: userRole || UserRole.ATHLETE,
        user_metadata: authSession.user.user_metadata,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }

      await this.safeCacheSession(accessToken, cachedSession)
      await this.safeCacheUser(
        authSession.user.id,
        this.formatUser(authSession.user)
      )

      this.logger.log(`User ${email} signed in successfully`)

      return {
        user: this.formatUser(authSession.user),
        access_token: accessToken,
        refresh_token: authSession.refresh_token,
        token_type: 'bearer'
      }
    } catch (error) {
      this.logger.error(
        `Sign in failed for ${email}: ${error.message}`,
        error.stack
      )

      // Propagar errores de autenticación específicos
      if (
        error instanceof InvalidCredentialsException ||
        error instanceof EmailNotConfirmedException
      ) {
        throw error
      }

      // Propagar otros errores conocidos (RpcException)
      if (error instanceof RpcException) {
        throw error
      }

      // Lanzar error genérico para errores desconocidos
      throw new RpcException({
        message:
          'No se pudo iniciar sesión. Por favor, verifica tus credenciales.',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  }

  /**
   * Helper para cachear sesión con manejo silencioso de errores
   */
  private async safeCacheSession(
    accessToken: string,
    session: CachedSession
  ): Promise<void> {
    try {
      await this.authRepository.cacheAuthSession(
        this.hashToken(accessToken),
        session,
        3600
      )
    } catch (cacheError) {
      // No fallar el login si el cache falla
      this.logger.warn(`Failed to cache session: ${cacheError.message}`)
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<AuthTokens | undefined> {
    const { refresh_token } = refreshTokenDto

    try {
      const authSession =
        await this.authRepository.refreshUserSession(refresh_token)

      const userRole = authSession.user.user_metadata?.role || UserRole.ATHLETE

      const payload: JwtPayload = {
        sub: authSession.user.id,
        email: authSession.user.email!,
        role: userRole,
        iat: Math.floor(Date.now() / 1000)
      }

      const access_token = this.jwtService.sign(payload, { expiresIn: '1h' })

      const cachedSession: CachedSession = {
        userId: authSession.user.id,
        email: authSession.user.email!,
        role: userRole,
        user_metadata: authSession.user.user_metadata,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }

      await this.safeCacheSession(access_token, cachedSession)

      this.logger.log(
        `Token refreshed successfully for user ${authSession.user.id}`
      )

      return {
        access_token,
        refresh_token: authSession.refresh_token,
        token_type: 'bearer',
        user: this.formatUser(authSession.user)
      }
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack)

      if (error instanceof RpcException) {
        throw error
      }

      throw new RpcException({
        message:
          'No se pudo actualizar el token. Por favor, intenta nuevamente.',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  }

  async signOut(jwt: string): Promise<{ message: string }> {
    try {
      const hashedToken = this.hashToken(jwt)
      await this.authRepository.deleteCachedAuthSession(hashedToken)

      this.logger.debug(
        'Deleted cached JWT with key: ' + hashedToken.substring(0, 10) + '...'
      )

      await this.authRepository.signOutUser(jwt)

      this.logger.log('User signed out successfully')

      return {
        message: 'Cierre de sesión exitoso'
      }
    } catch (error) {
      this.logger.error(`Sign out failed: ${error.message}`, error.stack)

      if (error instanceof RpcException) {
        throw error
      }

      throw new RpcException({
        message: 'No se pudo cerrar sesión. Por favor, intenta nuevamente.',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ success: boolean; message: string }> {
    const { email } = forgotPasswordDto

    try {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ??
        'http://localhost:3000'

      this.logger.log(`Sending password reset email to: ${email}`)

      const redirectUrl = `${frontendUrl}/auth/callback?redirect_to=/protected/reset-password`
      const { error } = await this.authRepository.sendPasswordResetEmail(
        email,
        redirectUrl
      )

      if (error) {
        this.logger.warn(
          `Failed to send reset email to ${email}: ${error.message}`
        )
        return {
          success: true,
          message:
            'Si el correo está registrado, recibirás un enlace de restablecimiento'
        }
      }

      this.logger.log(`Password reset email sent successfully to ${email}`)
      return {
        success: true,
        message:
          'Se ha enviado un enlace de restablecimiento a tu correo. Por favor revisa tu bandeja de entrada.'
      }
    } catch (error) {
      this.logger.error(
        `Unexpected error in forgotPassword for ${email}: ${error.message}`,
        error.stack
      )
      return {
        success: true,
        message:
          'Si el correo está registrado, recibirás un enlace de restablecimiento'
      }
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto

    try {
      const { error } = await this.authRepository.updateUserPassword(password)

      if (error) {
        this.logger.error(`Failed to reset password: ${error.message}`)
        throw new RpcException({
          message: 'Error al restablecer contraseña',
          statusCode: HttpStatus.BAD_REQUEST
        })
      }

      this.logger.log('Password reset successfully')
      return { message: 'Contraseña restablecida exitosamente' }
    } catch (error) {
      this.logger.error(`Password reset failed: ${error.message}`, error.stack)

      if (error instanceof RpcException) {
        throw error
      }

      throw new RpcException({
        message:
          'No se pudo restablecer la contraseña. Por favor, intenta nuevamente.',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  }

  async validateUserById(userId: string): Promise<User | null> {
    try {
      const authUser =
        await this.authRepository.findAuthUserByIdWithCache(userId)

      if (!authUser) {
        this.logger.debug(`User not found for validation: ${userId}`)
        return null
      }

      return this.formatUser(authUser)
    } catch (error) {
      this.logger.error(
        `Error validating user ${userId}: ${error.message}`,
        error.stack
      )
      return null
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    try {
      const authUser = await this.authRepository.findAuthUserById(userId)

      if (!authUser) {
        this.logger.warn(`User profile not found: ${userId}`)
        throw new UserNotFoundException(userId)
      }

      return this.formatUser(authUser)
    } catch (error) {
      this.logger.error(
        `Get user profile failed for ${userId}: ${error.message}`,
        error.stack
      )

      if (error instanceof RpcException) {
        throw error
      }

      throw new RpcException({
        message:
          'No se pudo obtener el perfil del usuario. Por favor, intenta nuevamente.',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  }

  private formatUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      email_confirmed_at: supabaseUser.email_confirmed_at,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
      last_sign_in_at: supabaseUser.last_sign_in_at,
      user_metadata: {
        role: supabaseUser.user_metadata?.role || UserRole.ATHLETE,
        full_name: supabaseUser.user_metadata?.full_name,
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        ...supabaseUser.user_metadata
      },
      app_metadata: supabaseUser.app_metadata || {}
    }
  }
  async changePassword({
    currentPassword,
    newPassword,
    id
  }: {
    currentPassword: string
    newPassword: string
    id: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      const userProfile = await this.getUserProfile(id)

      const daysRemaining = this.getDaysRemaining(
        userProfile.last_password_change as string,
        15
      )
      if (daysRemaining > 0) {
        this.logger.warn(
          `Password change attempt blocked for user ${id}: ${daysRemaining} days remaining`
        )
        throw new PasswordRecentlyChangedException(daysRemaining)
      }

      if (currentPassword === newPassword) {
        throw new SamePasswordException()
      }

      try {
        await this.authRepository.authenticateWithCredentials(
          userProfile.email,
          currentPassword
        )
      } catch (signInError) {
        this.logger.warn(
          `Failed password verification for user ${id}: ${signInError.message}`
        )

        if (signInError instanceof InvalidCredentialsException) {
          throw new RpcException({
            message:
              'La contraseña actual es incorrecta. Por favor, verifica e intenta nuevamente.',
            statusCode: HttpStatus.UNAUTHORIZED
          })
        }

        if (signInError instanceof RpcException) {
          throw signInError
        }

        throw new RpcException({
          message:
            'No se pudo verificar la contraseña actual. Intenta nuevamente.',
          statusCode: HttpStatus.BAD_REQUEST
        })
      }

      const { error: updateError } =
        await this.authRepository.updateUserPasswordById(
          userProfile.id,
          newPassword
        )

      if (updateError) {
        this.logger.error(
          `Failed to update password for user ${id}: ${updateError.message}`
        )
        throw new RpcException({
          message:
            'No se pudo actualizar la contraseña. Por favor, intenta nuevamente más tarde.',
          statusCode: HttpStatus.BAD_REQUEST
        })
      }

      try {
        await this.authRepository.authenticateWithCredentials(
          userProfile.email,
          newPassword
        )
      } catch (reauthError) {
        this.logger.error(
          `Failed to reauthenticate user ${id}: ${reauthError.message}`
        )
        throw new RpcException({
          message:
            'La contraseña se actualizó pero hubo un error al reautenticar. Por favor, inicia sesión nuevamente.',
          statusCode: HttpStatus.UNAUTHORIZED
        })
      }

      const { error: updateProfileError } =
        await this.authRepository.updateUserLastPasswordChange(userProfile.id)

      if (updateProfileError) {
        this.logger.warn(
          `Failed to update last_password_change for user ${id}: ${updateProfileError.message}`
        )
      }

      this.logger.log(`Password successfully changed for user ${id}`)
      return { success: true, message: 'Contraseña actualizada correctamente' }
    } catch (error) {
      this.logger.error(
        `Password change failed for user ${id}: ${error.message}`,
        error.stack
      )

      if (error instanceof RpcException) {
        throw error
      }

      throw new RpcException({
        message:
          'No se pudo actualizar la contraseña. Por favor, intenta nuevamente.',
        statusCode: HttpStatus.BAD_REQUEST
      })
    }
  }

  private getDaysRemaining(lastChange: string | null, period = 30): number {
    if (!lastChange) return 0
    const lastChangeDate = new Date(lastChange as string)
    const today = new Date()
    const daysSince = Math.floor(
      (today.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const daysRemaining = period - daysSince
    return daysRemaining > 0 ? daysRemaining : 0
  }
}
