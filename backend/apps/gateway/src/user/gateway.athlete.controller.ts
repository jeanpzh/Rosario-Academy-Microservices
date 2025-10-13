import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  Logger
} from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Roles } from '@common/decorators'
import { UserRole } from '@common/enums/user-roles.enum'
import { firstValueFrom } from 'rxjs'
import { ActionResponse } from 'apps/user-service/src/dto/update-profile.dto'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AthleteDetailsResponse } from '../dto/athlete-details-response.dto'
import { plainToInstance } from 'class-transformer'
import { ScheduleResponse } from '../dto/athlete-schedule-response.dto'

@Controller('athletes')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AthletesController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  async getById(@Param('id') id: string): Promise<AthleteDetailsResponse> {
    const athlete = await firstValueFrom(
      this.userClient.send('get_athlete_by_id', id)
    )
    return plainToInstance(AthleteDetailsResponse, athlete)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  async getAll() {
    return await firstValueFrom(this.userClient.send('get_all_athletes', {}))
  }

  @Get('distribution')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  async getDistribution() {
    return await firstValueFrom(
      this.userClient.send('get_athletes_distribution', {})
    )
  }

  @Post(':id/generate-verification-code')
  @Roles(UserRole.ATHLETE)
  async generateVerificationCode(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('generate_verification_code', { userId: id })
    )
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  async remove(@Param('id') id: string): Promise<ActionResponse> {
    return await firstValueFrom(
      this.userClient.send('delete_athlete', { userId: id })
    )
  }
  @Get('schedule/:id')
  @Roles(UserRole.ATHLETE)
  async getSchedule(@Param('id') id: string): Promise<ScheduleResponse> {
    return await firstValueFrom(
      this.userClient.send('get_athlete_schedule', id)
    )
  }
  @Get(':id/enrollment-requests')
  @Roles(UserRole.ATHLETE)
  async getEnrollmentRequests(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('get_athlete_enrollment_requests', id)
    )
  }
}
