import { UserRole } from "@common/enums/user-roles.enum"
export interface User {
  id: string
  email: string
  email_confirmed_at?: string | null
  created_at: string
  updated_at: string
  last_sign_in_at?: string | null
  user_metadata: {
    role?: UserRole
    full_name?: string
    avatar_url?: string
    [key: string]: any
  }
  app_metadata: {
    provider?: string
    providers?: string[]
    [key: string]: any
  }
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole | string
  iat: number
}
