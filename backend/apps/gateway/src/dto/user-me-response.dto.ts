import { Expose } from 'class-transformer'
@Expose()
export class UserMeResponseDto {
  userId: string
  email: string
  role: string
  iat: number
  exp?: number
  jti: string
}
