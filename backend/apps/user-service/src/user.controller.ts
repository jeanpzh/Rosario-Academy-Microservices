import { Controller } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateProfileDto, ActionResponse } from './dto/update-profile.dto'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_user_by_id')
  async getProfile(userId: string) {
    return this.userService.getProfileById(userId)
  }

  @MessagePattern('get_athlete_by_id')
  async getAthlete(athleteId: string) {
    return this.userService.getAthleteById(athleteId)
  }
  @MessagePattern('get_latest_avatar_change')
  async getLatestAvatarChange({ userId }: { userId: string }) {
    return this.userService.getLatestAvatarChangeById(userId)
  }

  @MessagePattern('update_profile')
  async updateProfile({
    userId,
    dto
  }: {
    userId: string
    dto: UpdateProfileDto
  }): Promise<ActionResponse> {
    return this.userService.updateProfile(dto, userId)
  }

  @MessagePattern('get_latest_profile_update')
  async getLatestProfileUpdate({ userId }: { userId: string }) {
    return this.userService.getLastProfileUpdateDate(userId)
  }

  @MessagePattern('change_avatar')
  async changeAvatar({ userId, file }: { userId: string; file: any }) {
    return this.userService.changeAvatar(file, userId)
  }

  @MessagePattern('generate_verification_code')
  async getGenerateVerificationCode({ userId }: { userId: string }) {
    return this.userService.getGenerateVerificationCodeById(userId)
  }

  @MessagePattern('get_shifts')
  async getShifts() {
    return this.userService.getShifts()
  }

  @MessagePattern('get_all_athletes')
  async getAllAthletes() {
    return this.userService.getAllAthletes()
  }

  @MessagePattern('get_all_assistants')
  async getAssistants() {
    return this.userService.getAllAssistants()
  }

  @MessagePattern('get_athletes_distribution')
  async getAthletesDistribution() {
    return this.userService.getAthletesDistribution()
  }

  @MessagePattern('delete_athlete')
  async deleteAthlete({ userId }: { userId: string }): Promise<ActionResponse> {
    return this.userService.deleteAthlete(userId)
  }

  /*  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseGuards(JwtAuthGuard)
  @Post('athlete')
  @UseInterceptors(FileInterceptor('file'))
  async addAthlete(
    @Body() data: AthleteFormData,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.addAthlete(data, file)
  } */
  /*   @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseGuards(JwtAuthGuard)
  @Get('assistant/:id')
  async getAssistant(@Param('id') id: string) {
    return this.userService.getAssistantById(id)
  }
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async getAdmin(@Param('id') id: string) {
    return this.userService.getAdminById(id)
  } */
}
