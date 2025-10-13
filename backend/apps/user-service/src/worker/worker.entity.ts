import { User } from '../users/user.entity'

export class Assistant extends User {
  constructor(
    id: string,
    email: string,
    dni: string,
    firstName: string,
    paternalLastName: string,
    maternalLastName: string,
    phone: string,
    role: string,
    birthDate: string,
    avatarUrl?: string,
    lastAvatarChange?: string | null
  ) {
    super(
      id,
      email,
      dni,
      firstName,
      paternalLastName,
      maternalLastName,
      phone,
      role,
      birthDate,
      avatarUrl,
      lastAvatarChange
    )
  }
}
