import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '@common/decorators'
import { GatewaySessionService } from '../gateway.session.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logger: Logger,
    private sessionService: GatewaySessionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('JwtAuthGuard: Checking authentication for protected route')
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
      this.logger.log(`Extracted token: ${token}`)

      if (!token) {
        this.logger.warn('No token provided in request')
        throw new UnauthorizedException('No token provided')
      }

      const session = await this.sessionService.validateToken(token)

      if (!session) {
        this.logger.warn('Invalid or expired token')
        throw new UnauthorizedException('Invalid or expired token')
      }

      request['user'] = session
      this.logger.log('user' + JSON.stringify(request.user))
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
    const cookieToken =
      request.cookies?.auth_session ||
      request.headers['authorization']?.slice(7)

    if (!cookieToken) {
      this.logger.warn('No auth_session cookie found')
      return undefined
    }

    return cookieToken
  }
}
