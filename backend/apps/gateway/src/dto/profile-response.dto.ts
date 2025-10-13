import { Exclude, Expose } from 'class-transformer'

export class ProfileResponseDTO {
  @Expose({ name: '_id' })
  id: string

  @Expose({ name: '_email' })
  email: string

  @Expose({ name: '_dni' })
  dni: string

  @Expose({ name: '_firstName' })
  firstName: string

  @Expose({ name: '_paternalLastName' })
  paternalLastName: string

  @Expose({ name: '_maternalLastName' })
  maternalLastName: string

  @Expose({ name: '_phone' })
  phone?: string

  @Expose({ name: '_role' })
  role: string

  @Expose()
  birthDate: string

  @Expose()
  avatarUrl?: string

  @Expose()
  lastAvatarChange?: Date | null

  @Expose()
  metadata?: Record<string, any>

  @Expose()
  address?: string

  @Expose()
  createdAt?: Date

  @Expose()
  updatedAt?: Date
}
