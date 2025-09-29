import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '@common/decorators'

interface JwtPayload {
  sub: string
  email: string
  role: string
  iat: number
  exp: number
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    try {
      const token = this.extractTokenFromRequest(request)

      if (!token) {
        this.logger.warn('No token provided in request')
        throw new UnauthorizedException('No token provided')
      }

      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      })

      request['user'] = payload

      return true
    } catch (error) {
      this.logger.error('JWT verification failed:', error.message)
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token format')
      } else if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired')
      }
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const cookieToken = request.cookies?.auth_session
    if (!cookieToken) {
      this.logger.warn('No auth_session cookie found')
      return undefined
    }

    return cookieToken
  }
}
