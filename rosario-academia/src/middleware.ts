/**
 * Next.js Middleware for Authentication and RBAC
 *
 * This middleware handles:
 * 1. JWT-based authentication validation
 * 2. Role-based access control (RBAC)
 * 3. Protected route enforcement
 * 4. Appropriate redirects for unauthorized access
 *
 * Note: This uses a custom JWT authentication system with backend-issued tokens
 * stored in HTTP-only cookies, not Supabase SSR directly.
 */

import { type NextRequest, NextResponse } from 'next/server'
import {
  hasRoleAccess,
  getRoleDefaultPath,
  isPublicRoute,
  extractUserRole
} from '@/lib/rbac.config'
import { validateJwt, type ValidatedUser } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    // Allow public routes without authentication
    if (isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // For protected routes (dashboard), validate JWT token
    if (pathname.startsWith('/dashboard')) {
      // Extract JWT token from cookies
      const token = request.cookies.get('auth_session')?.value

      if (!token) {
        console.warn(`[Middleware] No auth token found for: ${pathname}`)
        const redirectUrl = new URL('/sign-in', request.url)
        redirectUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Validate JWT token
      let user: ValidatedUser
      try {
        user = await validateJwt(token)
      } catch (error) {
        console.warn(
          `[Middleware] Invalid or expired token for: ${pathname}`,
          error instanceof Error ? error.message : 'Unknown error'
        )
        const redirectUrl = new URL('/sign-in', request.url)
        redirectUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      /**
       * Extract user role from user metadata
       * This avoids an extra database query
       * Role should be set during user registration
       */
      const userRole = extractUserRole(user)
      if (!userRole) {
        console.error(`[Middleware] User ${user.id} has no role assigned`)
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }

      // Handle /dashboard root - redirect to role-specific dashboard
      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        const defaultPath = getRoleDefaultPath(userRole)
        console.log(`[Middleware] Redirecting to default path: ${defaultPath}`)
        return NextResponse.redirect(new URL(defaultPath, request.url))
      }

      // RBAC: Check if user's role has access to the requested path
      if (!hasRoleAccess(userRole, pathname)) {
        const allowedPath = getRoleDefaultPath(userRole)
        console.warn(
          `[Middleware] Access denied: User (${userRole}) attempted to access ${pathname}. Redirecting to ${allowedPath}`
        )
        return NextResponse.redirect(new URL(allowedPath, request.url))
      }

      // Log successful access for audit purposes
      console.log(
        `[Middleware] Access granted: User (${userRole}) → ${pathname}`
      )
    }

    return NextResponse.next()
  } catch (error) {
    console.error('[Middleware] Unexpected error:', error)
    // On error, redirect to sign-in for security
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}

/**
 * Middleware matcher configuration
 * Optimized to exclude static assets and API routes
 *
 * Runs on all routes except:
 * - /_next/static (static files)
 * - /_next/image (image optimization)
 * - /favicon.ico
 * - Image files (.svg, .png, .jpg, .jpeg, .gif, .webp)
 * - /api routes
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)'
  ]
}
