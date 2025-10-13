import { HttpStatus } from '@nestjs/common'

export class WebhookResponseDto {
  message: string
  status: HttpStatus

  constructor(message: string, status: HttpStatus) {
    this.message = message
    this.status = status
  }
}
