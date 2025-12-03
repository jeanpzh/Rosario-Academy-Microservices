import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Logger,
  Request,
  Put,
  Delete,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCookieAuth,
  ApiConsumes
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Public, Roles } from '@common/decorators'
import { UserRole } from '@common/enums/user-roles.enum'
import { FileInterceptor } from '@nestjs/platform-express'
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager'
import { firstValueFrom } from 'rxjs'
import {
  ActionResponse,
  UpdateProfileDto
} from 'apps/user-service/src/dto/update-profile.dto'
import { ProfileResponseDTO } from '../dto/profile-response.dto'
import { plainToInstance } from 'class-transformer'
import { UserMeResponseDto } from '../dto/user-me-response.dto'
import { CloudinaryService } from '../services/cloudinary.service'
import { ChangeAvatarResponseDto } from '../dto/change-avatar-response.dto'
import { CreateAthleteDto } from '../dto/create-athlete.dto'
import { UpdateAthleteDto } from '../dto/update-athlete.dto'

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiCookieAuth('auth_session')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly cloudinaryService: CloudinaryService
  ) {}
  @Get('me')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get authenticated user information'
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: UserMeResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated'
  })
  async getMe(@Request() req: any): Promise<UserMeResponseDto> {
    Logger.log('req.user' + JSON.stringify(req.user))
    return plainToInstance(UserMeResponseDto, req.user)
  }

  @Get('shifts')
  @Public()
  @ApiOperation({
    summary: 'Get shifts',
    description: 'Get all available shifts (public)'
  })
  @ApiResponse({
    status: 200,
    description: 'Shifts retrieved successfully'
  })
  async getShifts() {
    return await firstValueFrom(this.userClient.send('get_shifts', {}))
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get user profile by ID (cached for 60s)'
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDTO
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async getById(@Param('id') id: string) {
    const profile = await firstValueFrom(
      this.userClient.send('get_user_by_id', id)
    )

    return plainToInstance(ProfileResponseDTO, profile)
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  async create(@Body() dto: any) {
    return await firstValueFrom(this.userClient.send('create_user', dto))
  }

  @Patch(':id')
  @Roles(UserRole.ATHLETE, UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update user profile information'
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto
  ): Promise<ActionResponse> {
    return await firstValueFrom(
      this.userClient.send('update_user', { userId: id, dto })
    )
  }

  @Patch(':id/avatar')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR, UserRole.ATHLETE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Change user avatar',
    description: 'Upload and update user avatar image'
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Avatar updated successfully',
    type: ChangeAvatarResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async changeAvatar(
    @Param('id') id: string,
    @UploadedFile() file: any
  ): Promise<ChangeAvatarResponseDto> {
    const avatarUrl = await this.cloudinaryService.uploadAvatar(file)

    const data = {
      userId: id,
      avatarUrl: avatarUrl
    }
    const result = await firstValueFrom(
      this.userClient.send('change_avatar', data)
    )

    return {
      avatarUrl: result.avatarUrl,
      message: 'Avatar actualizado correctamente'
    }
  }

  @Get('athletes')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Get all athletes',
    description: 'Get list of all registered athletes'
  })
  @ApiResponse({
    status: 200,
    description: 'Athletes list retrieved successfully'
  })
  async getAllAthletes() {
    return await firstValueFrom(this.userClient.send('get_all_athletes', {}))
  }

  @Post('athlete')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Create athlete',
    description: 'Create a new athlete with optional avatar'
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Athlete created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async createAthlete(@Body() body: any, @UploadedFile() file?: any) {
    try {
      let avatarUrl: string | null = null
      if (file) {
        avatarUrl = await this.cloudinaryService.uploadAvatar(file)
      }

      const athleteData = {
        first_name: body.first_name,
        paternal_last_name: body.paternal_last_name,
        maternal_last_name: body.maternal_last_name,
        birth_date: body.birth_date,
        dni: body.dni,
        phone: body.phone,
        email: body.email,
        level: body.level,
        height: body.height,
        weight: body.weight,
        avatar_url: avatarUrl
      }

      return await firstValueFrom(
        this.userClient.send('create_athlete', athleteData)
      )
    } catch (error: any) {
      const message = error?.message || 'Error al crear el deportista'
      const statusCode = error?.statusCode || HttpStatus.BAD_REQUEST
      throw new HttpException(message, statusCode)
    }
  }

  @Put('athlete/:id')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Update athlete',
    description: 'Update athlete information'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiBody({ type: UpdateAthleteDto })
  @ApiResponse({
    status: 200,
    description: 'Athlete updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Athlete not found'
  })
  async updateAthlete(@Param('id') id: string, @Body() dto: UpdateAthleteDto) {
    return await firstValueFrom(
      this.userClient.send('update_athlete', { id, dto })
    )
  }

  @Delete('athlete/:id')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Delete athlete',
    description: 'Delete an athlete by ID'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Athlete deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Athlete not found'
  })
  async deleteAthlete(@Param('id') id: string) {
    return await firstValueFrom(this.userClient.send('delete_athlete', id))
  }
}
