import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsObject
} from 'class-validator'
import { Type } from 'class-transformer'

class WebhookDataDto {
  @IsNotEmpty()
  @IsString()
  id: string
}

export class WebhookPayloadDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsBoolean()
  live_mode: boolean

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsDateString()
  date_created: string

  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsNotEmpty()
  @IsString()
  api_version: string

  @IsNotEmpty()
  @IsString()
  action: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WebhookDataDto)
  data: WebhookDataDto
}
