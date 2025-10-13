/**
 * Role-Based Access Control (RBAC) Configuration
 *
 * Centralizes all role definitions and access control rules
 * following the principle of single source of truth.
 */

export enum UserRole {
  ADMIN = 'admin',
  ATHLETE = 'deportista',
  AUXILIAR = 'auxiliar_administrativo'
}

/**
 * Maps each role to their allowed path prefixes
 * Admin implicitly has access to all routes
 */
export const ROLE_PATHS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['/dashboard/admin'],
  [UserRole.ATHLETE]: ['/dashboard/athlete'],
  [UserRole.AUXILIAR]: ['/dashboard/auxiliar']
}

/**
 * Default redirect paths for each role
 * Used when user accesses /dashboard or unauthorized route
 */
export const ROLE_REDIRECTS: Record<UserRole, string> = {
  [UserRole.ADMIN]: '/dashboard/admin',
  [UserRole.ATHLETE]: '/dashboard/athlete',
  [UserRole.AUXILIAR]: '/dashboard/auxiliar'
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/auth/callback',
  '/logout-cleanup',
  '/loading-data'
]

/**
 * Checks if a user with the given role can access the specified path
 *
 * @param userRole - The role of the user attempting access
 * @param pathname - The path being accessed
 * @returns true if access is allowed, false otherwise
 *
 * @example
 * ```ts
 * hasRoleAccess(UserRole.ATHLETE, '/dashboard/athlete') // true
 * hasRoleAccess(UserRole.ATHLETE, '/dashboard/admin') // false
 * hasRoleAccess(UserRole.ADMIN, '/dashboard/athlete') // true (admin has all access)
 * ```
 */
export function hasRoleAccess(userRole: string, pathname: string): boolean {
  // Check if role exists in configuration
  const allowedPaths = ROLE_PATHS[userRole as UserRole]
  if (!allowedPaths) {
    console.warn(`Unknown role encountered: ${userRole}`)
    return false
  }

  // Check if any allowed path matches the current pathname
  return allowedPaths.some((allowedPath) => pathname.startsWith(allowedPath))
}

/**
 * Gets the default redirect path for a user role
 *
 * @param userRole - The role of the user
 * @returns The default dashboard path for that role, or /sign-in as fallback
 *
 * @example
 * ```ts
 * getRoleDefaultPath(UserRole.ADMIN) // '/dashboard/admin'
 * getRoleDefaultPath('unknown') // '/sign-in'
 * ```
 */
export function getRoleDefaultPath(userRole: string): string {
  return ROLE_REDIRECTS[userRole as UserRole] || '/sign-in'
}

/**
 * Checks if a path is public (doesn't require authentication)
 *
 * @param pathname - The path to check
 * @returns true if the route is public, false otherwise
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    // Exact match for root
    if (route === '/' && pathname === '/') return true
    // Prefix match for other routes
    if (route !== '/') return pathname.startsWith(route)
    return false
  })
}

/**
 * Extracts the user role from Supabase user object
 * Handles both user_metadata.role and raw_user_meta_data.role
 *
 * @param user - The Supabase user object
 * @returns The user's role or null if not found
 */
export function extractUserRole(user: any): string | null {
  return user?.user_metadata?.role || user?.raw_user_meta_data?.role || null
}
