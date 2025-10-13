import { User } from '../users/user.entity'

export class Athlete {
  private level: 'beginner' | 'intermediate' | 'advanced'
  private height?: number
  private weight?: number
  private verificationId?: string
  private user: User
  constructor(
    user: User,
    level: 'beginner' | 'intermediate' | 'advanced',
    height?: number,
    weight?: number,
    verificationId?: string
  ) {
    this.user = user
    this.level = level
    this.height = height
    this.weight = weight
    this.verificationId = verificationId
  }
  get _level(): 'beginner' | 'intermediate' | 'advanced' {
    return this.level
  }
  get _user(): User {
    return this.user
  }

  /* constructor(
    id: string,
    email: string,
    dni: string,
    firstName: string,
    paternalLastName: string,
    maternalLastName: string,
    phone: string,
    role: string = 'deportista',
    birthDate: string,
    avatarUrl?: string,
    lastAvatarChange?: string | null,
    level: string = '',
    height?: number,
    weight?: number,
    verificationId?: string
  ) {
    super(
      id,
      email,
      dni,
      firstName,
      paternalLastName,
      maternalLastName,
      phone,
      (role = 'deportista'),
      birthDate,
      avatarUrl,
      lastAvatarChange
    )
    this.level = level
    this.height = height
    this.weight = weight
    this.verificationId = verificationId
  }

  get _height(): number | undefined {
    return this.height
  }
  get _weight(): number | undefined {
    return this.weight
  }
  get _level(): string {
    return this.level
  }
  get _verificationId(): string | undefined {
    return this.verificationId
  } */
}
