import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@common/decorators'
import { UserRole } from '@common/enums/user-roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      this.logger.warn('No user found in request')
      throw new ForbiddenException('User not authenticated')
    }

    const userRole = user.role

    if (!userRole) {
      this.logger.warn(`User ${user.id} has no role assigned`)
      throw new ForbiddenException('User has no role assigned')
    }

    const hasRole = requiredRoles.includes(userRole)

    if (!hasRole) {
      this.logger.warn(
        `User ${user.id} with role ${userRole} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`
      )
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`
      )
    }

    this.logger.log(`User ${user.id} with role ${userRole} granted access`)
    return true
  }
}
