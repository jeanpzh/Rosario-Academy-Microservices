import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
  HttpStatus
} from '@nestjs/common'
import {
  SupabaseClient,
  AuthError as SupabaseAuthError
} from '@supabase/supabase-js'
import { SUPABASE_CLIENT } from '@common/supabase/supabase.provider'
import { CacheBoundarie } from '@common/cache/cache.boundarie'
import {
  AuthRepository,
  AuthUser,
  AuthSession,
  SignUpOptions
} from './auth.repository'
import {
  AuthError,
  EmailNotConfirmedException,
  SignUpException,
  UserNotFoundException,
  InvalidCredentialsException
} from './errors'
import {
  isInvalidCredentialsError,
  isEmailNotConfirmedError,
  isSupabaseAuthError
} from './type-guards'

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private readonly logger = new Logger(AuthRepositoryImpl.name)

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly cache: CacheBoundarie
  ) {}

  async createAuthUser(options: SignUpOptions): Promise<AuthUser> {
    const { email, password, metadata } = options

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) {
      throw new SignUpException(error.message)
    }

    if (!data.user) {
      this.logger.error('No user data returned from Supabase after signup')
      throw new UserNotFoundException('CREATE_AUTH_USER')
    }

    this.logger.log(`Auth user created successfully: ${data.user.id}`)
    return data.user as AuthUser
  }

  async deleteAuthUserById(userId: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.deleteUser(userId)

    if (error) {
      throw new AuthError(
        error.message,
        HttpStatus.BAD_REQUEST,
        'deleteAuthUserById'
      )
    }

    this.logger.log(`Auth user ${userId} deleted successfully`)
  }

  async authenticateWithCredentials(
    email: string,
    password: string
  ): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      this.logger.error(JSON.stringify(error))

      // Type guard fuerte - Verificar credenciales inválidas
      if (isInvalidCredentialsError(error)) {
        this.logger.warn(`Invalid credentials for email: ${email}`)
        throw new InvalidCredentialsException()
      }

      // Type guard fuerte - Verificar email no confirmado
      if (isEmailNotConfirmedError(error)) {
        this.logger.warn(`Email not confirmed for: ${email}`)
        throw new EmailNotConfirmedException()
      }

      // Otros errores de autenticación con type safety
      if (isSupabaseAuthError(error)) {
        const authError = error as SupabaseAuthError
        throw new AuthError(
          authError.message || 'Error de autenticación',
          authError.status || HttpStatus.BAD_REQUEST,
          'authenticateWithCredentials'
        )
      }

      // Error completamente desconocido
      throw new AuthError(
        'Error inesperado durante la autenticación',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'authenticateWithCredentials'
      )
    }

    if (!data.user || !data.session) {
      this.logger.error('No user or session data returned after authentication')
      throw new AuthError(
        'No se recibieron datos de usuario o sesión',
        HttpStatus.BAD_REQUEST,
        'authenticateWithCredentials'
      )
    }

    this.logger.log(`User ${email} authenticated successfully`)
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user as AuthUser
    }
  }

  async refreshUserSession(refreshToken: string): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error) {
      throw new AuthError(error.message, error.status, 'refreshUserSession')
    }

    if (!data.session || !data.user) {
      this.logger.warn(
        'Failed to refresh session: Missing session or user data'
      )
      throw new AuthError(
        'Falló la actualización de la sesión. Credenciales no válidas.',
        HttpStatus.BAD_REQUEST,
        'refreshUserSession'
      )
    }

    this.logger.log(`Session refreshed successfully for user: ${data.user.id}`)
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user as AuthUser
    }
  }

  async signOutUser(jwt: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.signOut(jwt)

    if (error) {
      throw new AuthError(error.message, HttpStatus.BAD_REQUEST, 'signOutUser')
    }

    this.logger.log('User signed out successfully')
  }

  // ==================== Password Management Operations ====================

  async sendPasswordResetEmail(
    email: string,
    redirectUrl: string
  ): Promise<{ error?: Error }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })

      if (error) {
        this.logger.error(
          `Failed to send password reset email to ${email}: ${error.message}`
        )
        return { error }
      }

      this.logger.log(`Password reset email sent successfully to ${email}`)
      return {}
    } catch (error) {
      this.logger.error(
        `Unexpected error sending password reset email to ${email}: ${error.message}`
      )
      return { error }
    }
  }

  async updateUserPassword(password: string): Promise<{ error?: Error }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password
      })

      if (error) {
        this.logger.error(`Failed to update user password: ${error.message}`)
        return { error }
      }

      this.logger.log('User password updated successfully')
      return {}
    } catch (error) {
      this.logger.error(
        `Unexpected error updating user password: ${error.message}`
      )
      return { error }
    }
  }

  async updateUserPasswordById(
    userId: string,
    password: string
  ): Promise<{ error?: Error }> {
    try {
      const { error } = await this.supabase.auth.admin.updateUserById(userId, {
        password
      })

      if (error) {
        this.logger.error(
          `Failed to update password for user ${userId}: ${error.message}`
        )
        return { error }
      }

      this.logger.log(`Password updated successfully for user ${userId}`)
      return {}
    } catch (error) {
      this.logger.error(
        `Unexpected error updating password for user ${userId}: ${error.message}`
      )
      return { error }
    }
  }

  async findAuthUserById(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await this.supabase.auth.admin.getUserById(userId)

      if (error) {
        this.logger.warn(`Failed to find user ${userId}: ${error.message}`)
        return null
      }

      if (!data.user) {
        this.logger.debug(`User not found: ${userId}`)
        return null
      }

      return data.user as AuthUser
    } catch (error) {
      this.logger.error(
        `Unexpected error finding user ${userId}: ${error.message}`
      )
      return null
    }
  }

  async findAuthUserByIdWithCache(userId: string): Promise<AuthUser | null> {
    const cached = await this.getCachedUser(userId)
    if (cached) {
      this.logger.debug(`User cache HIT for userId: ${userId}`)
      return cached as AuthUser
    }

    this.logger.debug(`User cache MISS for userId: ${userId}`)

    const user = await this.findAuthUserById(userId)

    if (user) {
      try {
        await this.cacheUser(userId, user, 3600) // 1 hour TTL
      } catch (cacheError) {
        this.logger.warn(
          `Failed to cache user ${userId}: ${cacheError.message}`
        )
      }
    }

    return user
  }

  async updateUserLastPasswordChange(
    userId: string
  ): Promise<{ error?: Error }> {
    const { error } = await this.supabase
      .schema('users')
      .from('profiles')
      .update({ last_password_change: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      throw new AuthError(
        'Error al actualizar el último cambio de contraseña.',
        HttpStatus.BAD_REQUEST,
        'updateUserLastPasswordChange'
      )
    }

    this.logger.log(`Updated last_password_change for user ${userId}`)
    return {}
  }

  async cacheAuthSession(
    token: string,
    session: any,
    ttl: number
  ): Promise<void> {
    await this.cache.set(`auth:jwt:${token}`, JSON.stringify(session), ttl)
    this.logger.debug(
      `Cached auth session for token: ${token.substring(0, 10)}...`
    )
  }

  async getCachedAuthSession(token: string): Promise<any | null> {
    try {
      const cached = await this.cache.get<string>(`auth:jwt:${token}`)
      if (!cached) {
        this.logger.debug(
          `Cache miss for auth session: ${token.substring(0, 10)}...`
        )
        return null
      }
      this.logger.debug(
        `Cache hit for auth session: ${token.substring(0, 10)}...`
      )
      return JSON.parse(cached)
    } catch (error) {
      this.logger.error(
        `Failed to get cached auth session: ${error.message}`,
        error.stack
      )
      return null
    }
  }

  async deleteCachedAuthSession(token: string): Promise<void> {
    try {
      await this.cache.delete(`auth:jwt:${token}`)
      this.logger.debug(
        `Deleted cached auth session for token: ${token.substring(0, 10)}...`
      )
    } catch (error) {
      this.logger.error(
        `Failed to delete cached auth session: ${error.message}`,
        error.stack
      )
    }
  }

  async cacheUser(userId: string, user: any, ttl: number): Promise<void> {
    await this.cache.set(`user:${userId}`, user, ttl)
    this.logger.debug(`Cached user: ${userId}`)
  }

  async getCachedUser(userId: string): Promise<any | null> {
    try {
      const cached = await this.cache.get<any>(`user:${userId}`)
      if (cached) {
        this.logger.debug(`Cache hit for user: ${userId}`)
      } else {
        this.logger.debug(`Cache miss for user: ${userId}`)
      }
      return cached
    } catch (error) {
      this.logger.error(
        `Failed to get cached user: ${error.message}`,
        error.stack
      )
      return null
    }
  }
}
