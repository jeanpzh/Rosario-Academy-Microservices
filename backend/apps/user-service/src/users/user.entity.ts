const AVATAR_THRESHOLD = 30 * 24 * 60 * 60 * 1000

export class User {
  private readonly _id: string
  private _email: string
  private _dni: string
  private _firstName: string
  private _paternalLastName: string
  private _maternalLastName: string
  private _phone: string
  private _role: string
  private birthDate: string
  private avatarUrl: string
  private lastAvatarChange: string | null
  private lastProfileUpdate: string | null
  private metadata: Record<string, any>

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
    lastAvatarChange?: string | null,
    lastProfileUpdate?: string | null,
    metadata: Record<string, any> = {}
  ) {
    this._id = id
    this._email = email
    this._dni = dni
    this._firstName = firstName
    this._paternalLastName = paternalLastName
    this._maternalLastName = maternalLastName
    this._phone = phone
    this._role = role
    this.birthDate = birthDate
    this.avatarUrl = avatarUrl || ''
    this.lastAvatarChange = lastAvatarChange || null
    this.metadata = metadata
    this.lastProfileUpdate = lastProfileUpdate || null
  }

  canChangeAvatar(): boolean {
    if (!this.lastAvatarChange) return true
    const last = new Date(this.lastAvatarChange).getTime()
    const now = Date.now()
    return now - last >= AVATAR_THRESHOLD
  }

  getDaysUntilAvatarChange(): number {
    if (!this.lastAvatarChange) return 0
    const last = new Date(this.lastAvatarChange).getTime()
    const now = Date.now()
    return Math.ceil((AVATAR_THRESHOLD - (now - last)) / (24 * 60 * 60 * 1000))
  }
  get _metadata(): Record<string, any> {
    return this.metadata
  }

  get id(): string {
    return this._id
  }
  get email(): string {
    return this._email
  }
  get dni(): string {
    return this._dni
  }
  get firstName(): string {
    return this._firstName
  }
  get paternalLastName(): string {
    return this._paternalLastName
  }
  get maternalLastName(): string {
    return this._maternalLastName
  }
  get phone(): string {
    return this._phone
  }
  get role(): string {
    return this._role
  }
  get birthdate(): string {
    return this.birthDate
  }
  get avatar(): string {
    return this.avatarUrl
  }
  get lastAvatarChangeDate(): string | null {
    return this.lastAvatarChange
  }
}
