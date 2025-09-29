export class User {
  private readonly id: string
  private _email: string
  private _dni: string
  private _firstName: string
  private _paternalLastName: string
  private _maternalLastName: string
  private _phone: string
  private _role: string
  private birthDate: string
  private avatarUrl: string

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
    avatarUrl?: string
  ) {
    this.id = id
    this._email = email
    this._dni = dni
    this._firstName = firstName
    this._paternalLastName = paternalLastName
    this._maternalLastName = maternalLastName
    this._phone = phone
    this._role = role
    this.birthDate = birthDate
    this.avatarUrl = avatarUrl || ''
  }

  get _id(): string {
    return this.id
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
}
