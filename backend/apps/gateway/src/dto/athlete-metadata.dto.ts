// dto/athlete-metadata.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AthleteMetadataDto {
  @IsString()
  @IsNotEmpty()
  level!: string

  @IsString()
  @IsOptional()
  weight!: string

  @IsString()
  @IsOptional()
  height!: string

  @IsString()
  @IsOptional()
  planId!: string
}
