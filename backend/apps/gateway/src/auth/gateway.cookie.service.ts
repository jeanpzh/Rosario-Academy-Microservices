import { Injectable, Res } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class CookieService {
  setAuthCookies(
    @Res({ passthrough: true }) res: Response,
    accessToken: string
  ) {
    res.cookie('auth_session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hora
      path: '/'
    })
  }
  setRefreshTokenCookie(
    @Res({ passthrough: true }) res: Response,
    refreshToken: string
  ) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/'
    })
  }
  clearAuthCookies(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  }
  clearRefreshTokenCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  }
}
