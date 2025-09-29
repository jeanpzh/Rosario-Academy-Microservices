import { Roles } from '@common/decorators'
import { UserRole } from '@common/enums/user-roles.enum'
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard'
import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
  Body,
  Post,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices/client/client-proxy'
import {
  ActionResponse,
  UpdateProfileDto
} from 'apps/user-service/src/dto/update-profile.dto'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'
import { FileInterceptor } from '@nestjs/platform-express'
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager'

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Get('me/:id')
  @UseGuards(JwtAuthGuard)
  @CacheTTL(60)
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseInterceptors(CacheInterceptor)
  async getMe(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('get_user_by_id', { userId: id })
    )
  }
  @Get('athlete/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  async getAthlete(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('get_athlete_by_id', { athleteId: id })
    )
  }

  @Get('athlete/:id/latest-avatar-change')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  async getLatestAvatarChange(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('get_latest_avatar_change', { userId: id })
    )
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseGuards(JwtAuthGuard)
  @Patch('profile/:id')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param('id') id: string
  ): Promise<ActionResponse> {
    return await firstValueFrom(
      this.userClient.send('update_profile', {
        userId: id,
        dto: updateProfileDto
      })
    )
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseGuards(JwtAuthGuard)
  @Get('profile/:id/last-profile-update')
  async getLatestProfileUpdate(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('get_latest_profile_update', { userId: id })
    )
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseGuards(JwtAuthGuard)
  @Post('profile/:id/change-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async changeAvatar(@Param('id') id: string, @UploadedFile() file: any) {
    return await firstValueFrom(
      this.userClient.send('change_avatar', { userId: id, file })
    )
  }

  @Roles(UserRole.ATHLETE)
  @UseGuards(JwtAuthGuard)
  @Post('athlete/:id/generate-verification-code')
  async getGenerateVerificationCode(@Param('id') id: string) {
    return await firstValueFrom(
      this.userClient.send('generate_verification_code', { userId: id })
    )
  }

  @Get('shifts')
  async getShifts() {
    return await firstValueFrom(this.userClient.send('get_shifts', {}))
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseGuards(JwtAuthGuard)
  @Get('athletes')
  async getAllAthletes() {
    return await firstValueFrom(this.userClient.send('get_all_athletes', {}))
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get('assistants')
  async getAssistants() {
    return await firstValueFrom(this.userClient.send('get_all_assistants', {}))
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseGuards(JwtAuthGuard)
  @Get('athletes-distribution')
  async getAthletesDistribution() {
    return await firstValueFrom(
      this.userClient.send('get_athletes_distribution', {})
    )
  }

  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseGuards(JwtAuthGuard)
  @Delete('athlete/:id')
  async deleteAthlete(@Param('id') id: string): Promise<ActionResponse> {
    return await firstValueFrom(
      this.userClient.send('delete_athlete', { userId: id })
    )
  }
}
