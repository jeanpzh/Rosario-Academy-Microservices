interface Profile {
  id: string
  email: string
  dni: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  phone: string
  role: string
  birthDate: string
  avatarUrl?: string
  lastAvatarChange?: Date | null
  metadata?: Record<string, any>
  address?: string
  createdAt?: Date
  updatedAt?: Date
}