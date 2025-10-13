import { Injectable } from '@nestjs/common'
import { UserStrategy } from './user.strategy.port'
import { AthleteRepository } from 'apps/user-service/src/athletes/athlete.boundarie'
import { User } from '../users/user.entity'
import { Athlete } from 'apps/user-service/src/athletes/athlete.entity'

@Injectable()
export class AthleteRegisterStrategy implements UserStrategy {
  constructor(private readonly athleteRepository: AthleteRepository) {}

  async registerUser(
    userData: User,
    metadata: { [key: string]: any }
  ): Promise<void> {
    const level = metadata?.level as 'beginner' | 'intermediate' | 'advanced'

    const athlete = new Athlete(
      userData,
      level,
      metadata?.height,
      metadata?.weight
    )

    await this.athleteRepository.save(athlete)
    const assignedSchedule =
      await this.athleteRepository.getScheduleFromLevel(level)
    await this.athleteRepository.assignSchedule(userData.id, assignedSchedule)
  }
}
