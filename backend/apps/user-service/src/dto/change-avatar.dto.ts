import { Expose } from 'class-transformer'

@Expose()
export class ChangeAvatarDto {
  userId: string
  avatarUrl: string
}

export class ChangeAvatarResponseDto {
  avatarUrl: string
  message: string
}
