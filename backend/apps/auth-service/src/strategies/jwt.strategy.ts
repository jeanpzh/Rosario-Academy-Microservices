import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'FALLBACK_SECRET'
    })
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { sub, email, role } = payload

    if (!sub || !email) {
      throw new UnauthorizedException('Invalid token payload')
    }

    return {
      id: sub,
      email,
      user_metadata: {
        role
      }
    }
  }
}
