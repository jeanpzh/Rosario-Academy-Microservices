import { NextRequest } from 'next/server'

/**
 * Extrae el token de autenticación de las cookies de manera segura
 * Sigue las mejores prácticas de seguridad recomendadas
 */
export function extractAuthToken(request: NextRequest): string | null {
  const authSession = request.cookies.get('auth_session')?.value
  if (authSession) {
    return authSession
  }

  const supabaseToken = request.cookies.get(
    'sb-cfspxuhuawyoxbobbpme-auth-token'
  )?.value
  if (supabaseToken) {
    return supabaseToken
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

/**
 * Extrae el refresh token de las cookies
 */
export function extractRefreshToken(request: NextRequest): string | null {
  // Buscar el refresh token principal
  const refreshToken = request.cookies.get('refresh_token')?.value
  if (refreshToken) {
    return refreshToken
  }

  // Buscar refresh tokens de Supabase como fallback
  const supabaseRefresh = request.cookies.get(
    'sb-cfspxuhuawyoxbobbpme-auth-token-refresh'
  )?.value
  if (supabaseRefresh) {
    return supabaseRefresh
  }

  // Buscar refresh tokens con nombres dinámicos
  const cookieNames = request.cookies.getAll()
  for (const cookie of cookieNames) {
    if (cookie.name.startsWith('__refresh_')) {
      return cookie.value
    }
  }

  return null
}

/**
 * Verifica si el token está próximo a expirar
 */
export function isTokenNearExpiry(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // Convertir a milisegundos
    const now = Date.now()
    const timeUntilExpiry = exp - now

    // Si expira en menos de 5 minutos, considerar que necesita refresh
    return timeUntilExpiry < 5 * 60 * 1000
  } catch {
    return true // Si no puede parsear, asumir que necesita refresh
  }
}
