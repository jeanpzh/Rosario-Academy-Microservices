import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

interface AuthCallbackResult {
  success: boolean
  redirectTo: string
  error?: string
}

async function handleAuthCallback(
  searchParams: URLSearchParams
): Promise<AuthCallbackResult> {
  const supabase = createClient()
  const redirectTo = searchParams.get('redirect_to') || '/protected'

  try {
    // Check if we have hash parameters (for password reset/email confirmation)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    // Handle hash-based authentication (password reset, magic link, etc.)
    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (sessionError) {
        return {
          success: false,
          redirectTo: `/sign-in?error=${encodeURIComponent(sessionError.message)}`,
          error: sessionError.message
        }
      }

      return { success: true, redirectTo }
    }

    // Handle code-based authentication (OAuth, PKCE flow)
    const code = searchParams.get('code')
    if (code) {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        return {
          success: false,
          redirectTo: `/sign-in?error=${encodeURIComponent(exchangeError.message)}`,
          error: exchangeError.message
        }
      }

      return { success: true, redirectTo }
    }

    // Handle token_hash based authentication (OTP verification)
    const tokenHash = searchParams.get('token_hash')
    const verifyType = searchParams.get('type')

    if (tokenHash && verifyType) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: verifyType as any
      })

      if (verifyError) {
        return {
          success: false,
          redirectTo: `/sign-in?error=${encodeURIComponent(verifyError.message)}`,
          error: verifyError.message
        }
      }

      return { success: true, redirectTo }
    }

    // If no recognized parameters, redirect to sign-in
    return {
      success: false,
      redirectTo: '/sign-in',
      error: 'No se encontraron parámetros de autenticación válidos'
    }
  } catch (err) {
    console.error('Unexpected error in auth callback:', err)
    return {
      success: false,
      redirectTo: '/sign-in',
      error: 'Ocurrió un error inesperado'
    }
  }
}

export function useAuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = useQuery({
    queryKey: ['auth-callback', searchParams.toString()],
    queryFn: () => handleAuthCallback(searchParams),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false
  })

  // Auto-redirect when the query succeeds
  if (query.isSuccess && query.data) {
    router.push(query.data.redirectTo)
  }

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.data?.error || query.error?.message,
    isSuccess: query.isSuccess && query.data?.success
  }
}
