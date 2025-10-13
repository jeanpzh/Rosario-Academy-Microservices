import { CacheBoundarie } from '@common/cache/cache.boundarie'
import { UserRole } from '@common/enums/user-roles.enum'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@supabase/supabase-js'
import * as crypto from 'crypto'

interface CachedSession {
  userId: string
  email: string
  role: UserRole
  iat: number
  jti: string
  exp?: number
}

@Injectable()
export class GatewaySessionService {
  constructor(
    private readonly cache: CacheBoundarie,
    private readonly jwtService: JwtService,
    private logger: Logger
  ) {}
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
      app_metadata: supabaseUser.app_metadata || {},
      aud: supabaseUser.aud!
    }
  }

  private hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .substring(0, 32)
  }
  async validateToken(token: string): Promise<CachedSession> {
    const cacheKey = `auth:jwt:${this.hashToken(token)}`

    try {
      const cached = await this.cache.get<string>(cacheKey)

      if (cached) {
        const cachedUser = JSON.parse(cached)

        const session: CachedSession = {
          userId: cachedUser.userId,
          email: cachedUser.email,
          role: cachedUser.role,
          iat: cachedUser.iat,
          jti: cachedUser.jti,
          exp: cachedUser.exp
        }
        if (session.exp && session.exp * 1000 > Date.now()) {
          this.logger.debug('JWT Cache HIT')
          return session
        }

        await this.cache.delete(cacheKey)
      }

      const payload = this.jwtService.verify(token)
      const userId = payload.sub
      if (!userId) {
        throw new UnauthorizedException('Token inválido: falta userId')
      }
      const exp = payload.exp ?? Math.floor(Date.now() / 1000) + 3600

      const session: CachedSession = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        iat: payload.iat,
        jti: payload.jti
      }

      this.logger.debug(JSON.stringify(session))
      const ttl = exp - Math.floor(Date.now() / 1000)

      if (ttl > 0) {
        await this.cache.set(cacheKey, JSON.stringify(session), ttl)
      }

      return session
    } catch (error) {
      this.logger.error('Error validating token:', error.message)
      throw new UnauthorizedException('Token inválido o expirado')
    }
  }
}
