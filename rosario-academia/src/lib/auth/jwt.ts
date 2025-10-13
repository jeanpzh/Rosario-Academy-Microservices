/**
 * JWT Validation Utilities for Custom Auth System
 *
 * This module provides JWT validation for the custom authentication system
 * that uses backend-issued JWTs stored in HTTP-only cookies.
 */

import { jwtVerify } from 'jose'

interface JwtPayload {
  sub: string // user ID
  email: string
  role: string
  iat: number
  exp?: number
}

export interface ValidatedUser {
  id: string
  email: string
  user_metadata: {
    role: string
  }
}

/**
 * Validates a JWT token using the JWT_SECRET
 * @param token - The JWT token to validate
 * @returns The validated user data
 * @throws Error if token is invalid or expired
 */
export async function validateJwt(token: string): Promise<ValidatedUser> {
  try {
    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
      throw new Error('JWT_SECRET is not configured in environment variables')
    }

    const secret = new TextEncoder().encode(secretKey)

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    })

    const jwtPayload = payload as unknown as JwtPayload

    // Validate required fields
    if (!jwtPayload.sub || !jwtPayload.email || !jwtPayload.role) {
      throw new Error('Invalid JWT payload: missing required fields')
    }

    // Check expiration if present
    if (jwtPayload.exp) {
      const now = Math.floor(Date.now() / 1000)
      if (jwtPayload.exp < now) {
        throw new Error('JWT token has expired')
      }
    }

    return {
      id: jwtPayload.sub,
      email: jwtPayload.email,
      user_metadata: {
        role: jwtPayload.role
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`JWT validation failed: ${error.message}`)
    }
    throw new Error('JWT validation failed: Unknown error')
  }
}

/**
 * Extracts the JWT token from the cookies
 * @param cookieHeader - The cookie header string
 * @returns The JWT token or null if not found
 */
export function extractTokenFromCookies(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').map((c) => c.trim())
  const authCookie = cookies.find((c) => c.startsWith('auth_session='))

  if (!authCookie) return null

  return authCookie.split('=')[1]
}
