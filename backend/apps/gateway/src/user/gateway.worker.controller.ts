import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Delete
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCookieAuth
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '@common/decorators'
import { UserRole } from '@common/enums/user-roles.enum'
import { firstValueFrom } from 'rxjs'
import { UpdateAthleteStatusDto } from '../dto/update-athlete-status.dto'
import { UpdateAthleteLevelDto } from '../dto/update-athlete-level.dto'
import { CreateAssistantDto } from '../dto/create-assistant.dto'
import { UpdateAssistantDto } from '../dto/update-assistant.dto'

@ApiTags('Workers')
@Controller('worker')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiCookieAuth('auth_session')
export class WorkerController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}
  @Get('assistants')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all assistants',
    description: 'Get list of all assistants (Admin only)'
  })
  @ApiResponse({
    status: 200,
    description: 'Assistants list retrieved successfully'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required'
  })
  async getAllAssistants() {
    return await firstValueFrom(this.userClient.send('get_all_assistants', {}))
  }

  @Get('athletes')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Get all athletes',
    description: 'Get list of all athletes (Admin/Auxiliar)'
  })
  @ApiResponse({
    status: 200,
    description: 'Athletes list retrieved successfully'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Auxiliar role required'
  })
  async getAllAthletes() {
    return await firstValueFrom(this.userClient.send('get_all_athletes', {}))
  }

  @Get('athlete-distribution')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Get athlete distribution',
    description: 'Get athlete distribution statistics by level/shift'
  })
  @ApiResponse({
    status: 200,
    description: 'Distribution data retrieved successfully'
  })
  async getAthleteDistribution() {
    return await firstValueFrom(
      this.userClient.send('get_athlete_distribution', {})
    )
  }

  @Put('/:id/athlete/status')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Update athlete status',
    description: 'Update athlete status (active/inactive)'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiBody({ type: UpdateAthleteStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Athlete status updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Athlete not found'
  })
  async updateAthleteStatus(
    @Param('id') id: string,
    @Body() updateAthleteStatusDto: UpdateAthleteStatusDto
  ) {
    return await firstValueFrom(
      this.userClient.send('update_athlete_status', {
        id,
        status: updateAthleteStatusDto.status
      })
    )
  }

  @Put('/:id/athlete/level')
  @Roles(UserRole.ADMIN, UserRole.AUXILIAR)
  @ApiOperation({
    summary: 'Update athlete level',
    description: 'Update athlete training level'
  })
  @ApiParam({ name: 'id', description: 'Athlete ID', type: String })
  @ApiBody({ type: UpdateAthleteLevelDto })
  @ApiResponse({
    status: 200,
    description: 'Athlete level updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Athlete not found'
  })
  async updateAthleteLevel(
    @Param('id') id: string,
    @Body() updateAthleteLevelDto: UpdateAthleteLevelDto
  ) {
    return await firstValueFrom(
      this.userClient.send('update_athlete_level', {
        id,
        level: updateAthleteLevelDto.level
      })
    )
  }
  @Post('/assistant')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create assistant',
    description: 'Create a new assistant/auxiliar (Admin only)'
  })
  @ApiBody({ type: CreateAssistantDto })
  @ApiResponse({
    status: 201,
    description: 'Assistant created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required'
  })
  async createAssistant(@Body() createAssistantDto: CreateAssistantDto) {
    return await firstValueFrom(
      this.userClient.send('create_assistant', createAssistantDto)
    )
  }

  @Put('/assistant/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update assistant',
    description: 'Update assistant information (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Assistant ID', type: String })
  @ApiBody({ type: UpdateAssistantDto })
  @ApiResponse({
    status: 200,
    description: 'Assistant updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Assistant not found'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required'
  })
  async updateAssistant(
    @Param('id') id: string,
    @Body() updateAssistantDto: UpdateAssistantDto
  ) {
    return await firstValueFrom(
      this.userClient.send('update_assistant', { id, dto: updateAssistantDto })
    )
  }

  @Delete('/assistant/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete assistant',
    description: 'Delete an assistant by ID (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Assistant ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Assistant deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Assistant not found'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required'
  })
  async deleteAssistant(@Param('id') id: string) {
    return await firstValueFrom(this.userClient.send('delete_assistant', id))
  }

  @Get('athletes-with-payments')
  @ApiOperation({
    summary: 'Get athletes with payments',
    description: 'Get all athletes with their payment information'
  })
  @ApiResponse({
    status: 200,
    description: 'Athletes with payments retrieved successfully'
  })
  async getAthletesWithPayments() {
    return await firstValueFrom(
      this.userClient.send('get_athletes_with_payments', {})
    )
  }
}
