import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@Expose()
export class CreatePreferenceDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string

  @ApiProperty({
    description: 'Plan ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @IsNotEmpty()
  @IsUUID()
  planId: string

  @ApiProperty({
    description: 'Schedule ID',
    example: 1,
    type: Number
  })
  @IsNotEmpty()
  @IsNumber()
  schedule_id: number
}
