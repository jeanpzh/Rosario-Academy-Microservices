import {
  AuthError as SupabaseAuthError,
  isAuthError,
  isAuthApiError
} from '@supabase/supabase-js'

/**
 * Type guard fuerte para verificar credenciales inválidas
 * Verifica que sea un error de autenticación con el código específico
 */
export function isInvalidCredentialsError(
  error: unknown
): error is SupabaseAuthError {
  return isAuthApiError(error) && error.code === 'invalid_credentials'
}

/**
 * Type guard fuerte para verificar email no confirmado
 */
export function isEmailNotConfirmedError(
  error: unknown
): error is SupabaseAuthError {
  return isAuthApiError(error) && error.code === 'email_not_confirmed'
}

/**
 * Type guard para verificar si es un error de Supabase Auth
 */
export function isSupabaseAuthError(
  error: unknown
): error is SupabaseAuthError {
  return isAuthError(error)
}

/**
 * Type guard para verificar si es un error de API de Supabase Auth
 */
export function isSupabaseAuthApiError(
  error: unknown
): error is SupabaseAuthError {
  return isAuthApiError(error)
}

/**
 * Type guard para verificar usuario no encontrado
 */
export function isUserNotFoundError(
  error: unknown
): error is SupabaseAuthError {
  return isAuthApiError(error) && error.code === 'user_not_found'
}

/**
 * Type guard para verificar token inválido
 */
export function isInvalidTokenError(
  error: unknown
): error is SupabaseAuthError {
  return (
    isAuthApiError(error) &&
    (error.code === 'invalid_grant' || error.code === 'invalid_token')
  )
}

/**
 * Type guard para verificar password débil
 */
export function isWeakPasswordError(
  error: unknown
): error is SupabaseAuthError {
  return isAuthApiError(error) && error.code === 'weak_password'
}
