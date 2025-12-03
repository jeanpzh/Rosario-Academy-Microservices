import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect_to') ?? '/protected'
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  // Handle code-based authentication (PKCE flow)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error.message)
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.message)}`
      )
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // Handle token_hash based authentication (email confirmation, password reset)
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any
    })

    if (error) {
      console.error('Error verifying OTP:', error.message)
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.message)}`
      )
    }

    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // No code or token_hash, redirect to sign-in with error
  return NextResponse.redirect(
    `${origin}/sign-in?error=${encodeURIComponent('Missing authentication parameters')}`
  )
}
