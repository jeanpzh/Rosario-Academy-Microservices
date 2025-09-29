import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Inject,
  Res
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from './dto/auth.dto'
import { User, AuthTokens, JwtPayload } from './entities/user.entity'
import { UserRole } from '@common/enums/user-roles.enum'
import { throwAuthError } from './errors'
import { Response } from 'express'

@Injectable()
export class AuthService {
  private supabase: SupabaseClient

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
    )
  }

  async signUp(
    signUpDto: SignUpDto,
    res: Response
  ): Promise<{ user: User; message: string }> {
    const {
      email,
      password,
      role = UserRole.ATHLETE,
      first_name,
      paternal_last_name,
      maternal_last_name,
      birth_date,
      dni,
      level,
      avatar_url,
      phone
    } = signUpDto
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            paternal_last_name,
            maternal_last_name,
            birth_date,
            dni,
            level,
            role,
            avatar_url: avatar_url || null,
            phone
          }
        }
      })
      if (error) {
        console.log(error)
        throw new BadRequestException('El email es inválido o ya está en uso')
      }

      const userMetadata = {
        userId: data?.user?.id as string,
        email: data?.user?.email!,
        userData: {
          first_name,
          paternal_last_name,
          maternal_last_name,
          birth_date,
          dni,
          level,
          role,
          avatar_url: avatar_url || null,
          phone
        }
      }

      const { error: rpcError } = await this.supabase.rpc('process_new_user', {
        p_id: userMetadata.userId,
        p_email: userMetadata.email,
        p_raw_user_meta_data: userMetadata.userData
      })

      if (rpcError) {
        throw new Error(`Error en RPC process_new_user: ${rpcError.message}`)
      }

      const payload: JwtPayload = {
        sub: data?.user?.id as string,
        email: data?.user?.email!,
        role: role,
        iat: Math.floor(Date.now() / 1000)
      }

      const access_token = this.jwtService.sign(payload, {
        expiresIn: '1h'
      })
      const user = this.formatUser(data?.user)
      this.setCookies(res, {
        access_token,
        refresh_token: data?.session?.refresh_token as string,
        token_type: 'bearer',
        user
      })
      return {
        user,
        message: 'Usuario registrado exitosamente'
      }
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        console.log(error)
        throw error
      }
      console.error('Error en signUp:', error)
      throw new BadRequestException('Error al registrar usuario')
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthTokens> {
    const { email, password } = signInDto
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos')
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throwAuthError(error)
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException('Error en la autenticación')
      }

      const userRole = data.user.user_metadata?.role

      const payload: JwtPayload = {
        sub: data.user.id,
        email: data.user.email!,
        role: userRole,
        iat: Math.floor(Date.now() / 1000)
      }
      const accessToken = this.jwtService.sign(payload)

      return {
        access_token: accessToken,
        refresh_token: data.session.refresh_token,
        token_type: 'bearer',
        user: this.formatUser(data.user)
      }
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Error en la autenticación')
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    const { refresh_token } = refreshTokenDto

    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token
      })

      if (error || !data.session || !data.user) {
        throw new UnauthorizedException('Token de refresco inválido')
      }

      const userRole = data.user.user_metadata?.role || UserRole.ATHLETE

      // Generar nuevo JWT personalizado
      const payload: JwtPayload = {
        sub: data.user.id,
        email: data.user.email!,
        role: userRole,
        iat: Math.floor(Date.now() / 1000)
      }

      const access_token = this.jwtService.sign(payload, { expiresIn: '1h' })

      return {
        access_token,
        refresh_token: data.session.refresh_token,
        token_type: 'bearer',
        user: this.formatUser(data.user)
      }
    } catch (error) {
      throw new UnauthorizedException('Error al refrescar token')
    }
  }

  async signOut(
    jwt: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    try {
      const { error } = await this.supabase.auth.admin.signOut(jwt)
      if (error) {
        throw new BadRequestException('Error al cerrar sesión')
      }
      this.clearCookies(res)

      return {
        message: 'Cierre de sesión exitoso'
      }
    } catch (error) {
      throw new BadRequestException('Error al cerrar sesión')
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`
      })

      if (error) {
        throw new BadRequestException('Error al enviar email de recuperación')
      }

      return { message: 'Email de recuperación enviado' }
    } catch (error) {
      throw new BadRequestException('Error al enviar email de recuperación')
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto

    try {
      const { error } = await this.supabase.auth.updateUser({
        password
      })

      if (error) {
        throw new BadRequestException('Error al restablecer contraseña')
      }

      return { message: 'Contraseña restablecida exitosamente' }
    } catch (error) {
      throw new BadRequestException('Error al restablecer contraseña')
    }
  }

  async validateUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.admin.getUserById(userId)

      if (error || !data.user) {
        return null
      }

      return this.formatUser(data.user)
    } catch (error) {
      return null
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    try {
      const { data, error } = await this.supabase.auth.admin.getUserById(userId)

      if (error || !data.user) {
        throw new UnauthorizedException('Usuario no encontrado')
      }

      return this.formatUser(data.user)
    } catch (error) {
      throw new UnauthorizedException('Error al obtener perfil de usuario')
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
  }) {
    const { data: userProfile, error: userError } = await this.supabase
      .schema('users')
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (userError || !userProfile) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    const daysRemaining = this.getDaysRemaining(
      userProfile.last_password_change as string,
      15
    )
    if (daysRemaining > 0) {
      throw new BadRequestException(
        `No puedes cambiar tu contraseña hasta ${daysRemaining} días`
      )
    }

    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email: userProfile.email,
      password: currentPassword
    })

    if (signInError) {
      throw new UnauthorizedException('Contraseña actual incorrecta')
    }

    const { error: updateError } =
      await this.supabase.auth.admin.updateUserById(userProfile.id, {
        password: newPassword
      })
    if (updateError) {
      throw new BadRequestException('Error actualizando la contraseña')
    }

    const { error: reauthError } = await this.supabase.auth.signInWithPassword({
      email: userProfile.email,
      password: newPassword
    })
    if (reauthError) {
      throw new UnauthorizedException('Error reautenticando')
    }
    // Update the last password change date
    const { error: updateProfileError } = await this.supabase
      .schema('users')
      .from('profiles')
      .update({ last_password_change: new Date().toISOString() })
      .eq('id', userProfile.id)
    if (updateProfileError) {
      throw new BadRequestException('Error actualizando el perfil')
    }

    return { success: true, message: 'Contraseña actualizada correctamente' }
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
  private clearCookies(res: Response) {
    res.clearCookie('auth_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  }
  private setCookies(res: Response, result: AuthTokens) {
    // Establecer cookies HttpOnly seguras
    res.cookie('auth_session', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hora
      path: '/'
    })

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 días
      path: '/'
    })
  }
}
