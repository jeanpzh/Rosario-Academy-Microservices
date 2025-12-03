import { Injectable, Res } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class CookieService {
  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production'
    return {
      httpOnly: true,
      secure: isProduction, // HTTPS requerido en producción
      sameSite: isProduction ? ('none' as const) : ('lax' as const), // 'none' para cross-origin en producción
      path: '/'
      // domain: isProduction ? '.tudominio.com' : undefined
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
