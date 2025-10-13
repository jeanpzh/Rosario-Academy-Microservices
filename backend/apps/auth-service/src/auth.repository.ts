import { UserMetadata } from '@supabase/supabase-js'
import { UserRole } from '@common/enums/user-roles.enum'

export interface AuthUser {
  id: string
  email: string
  email_confirmed_at?: string
  created_at: string
  updated_at: string
  last_sign_in_at?: string
  user_metadata: UserMetadata
  app_metadata?: any
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export interface SignUpOptions {
  email: string
  password: string
  metadata: {
    firstName: string
    paternalLastName: string
    maternalLastName: string
    birthdate: string
    dni: string
    role: UserRole
    avatar: string
    phone: string
    dni_verified: boolean
  }
}

export abstract class AuthRepository {
  // User registration operations
  abstract createAuthUser(options: SignUpOptions): Promise<AuthUser>
  abstract deleteAuthUserById(userId: string): Promise<void>

  // Authentication operations
  abstract authenticateWithCredentials(
    email: string,
    password: string
  ): Promise<AuthSession>
  abstract refreshUserSession(refreshToken: string): Promise<AuthSession>
  abstract signOutUser(jwt: string): Promise<void>

  // Password management operations
  abstract sendPasswordResetEmail(
    email: string,
    redirectUrl: string
  ): Promise<{ error?: Error }>
  abstract updateUserPassword(password: string): Promise<{ error?: Error }>
  abstract updateUserPasswordById(
    userId: string,
    password: string
  ): Promise<{ error?: Error }>

  // User retrieval operations
  abstract findAuthUserById(userId: string): Promise<AuthUser | null>
  abstract findAuthUserByIdWithCache(userId: string): Promise<AuthUser | null>

  // Profile operations
  abstract updateUserLastPasswordChange(
    userId: string
  ): Promise<{ error?: Error }>

  // Cache operations
  abstract cacheAuthSession(
    token: string,
    session: any,
    ttl: number
  ): Promise<void>
  abstract getCachedAuthSession(token: string): Promise<any | null>
  abstract deleteCachedAuthSession(token: string): Promise<void>
  abstract cacheUser(userId: string, user: any, ttl: number): Promise<void>
  abstract getCachedUser(userId: string): Promise<any | null>
}
