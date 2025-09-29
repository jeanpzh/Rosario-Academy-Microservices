import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { Public } from '@common/decorators'

@Controller('/auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy
  ) {}
  @Post('verify-connection')
  @HttpCode(HttpStatus.OK)
  async verifyConnection(@Body() body: { message: string }) {
    return await firstValueFrom(this.authClient.send('verify_connection', body))
  }
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: { email: string; password: string }) {
    return await firstValueFrom(this.authClient.send('signin', body))
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@Request() req) {
    return await firstValueFrom(this.authClient.send('signout', req))
  }
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body) {
    return await firstValueFrom(this.authClient.send('signup', body))
  }
}
