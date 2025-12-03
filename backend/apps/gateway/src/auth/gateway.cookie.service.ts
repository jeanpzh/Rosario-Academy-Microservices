import { Injectable, Logger, Res } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class CookieService {
  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production'
    Logger.log(
      `Setting cookie options for ${isProduction ? 'production' : 'development'} environment`,
      'CookieService'
    )
    return {
      httpOnly: true,
      secure: isProduction, // HTTPS requerido en producción
      sameSite: isProduction ? ('lax' as const) : ('lax' as const), // 'lax' es suficiente para mismo dominio
      path: '/',
      domain: isProduction ? '.fisib22.com' : undefined // Compartir cookie entre subdominios
    }
  }

  setAuthCookies(
    @Res({ passthrough: true }) res: Response,
    accessToken: string
  ) {
    res.cookie('auth_session', accessToken, {
      ...this.getCookieOptions(),
      maxAge: 60 * 60 * 1000 // 1 hora
    })
  }
  setRefreshTokenCookie(
    @Res({ passthrough: true }) res: Response,
    refreshToken: string
  ) {
    res.cookie('refresh_token', refreshToken, {
      ...this.getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    })
  }
  clearAuthCookies(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_session', this.getCookieOptions())
  }
  clearRefreshTokenCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', this.getCookieOptions())
  }
}
