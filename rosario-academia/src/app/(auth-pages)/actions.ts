'use server'

import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { signUpSchema } from '@/app/(auth-pages)/schemas/sign-up-schema'
import { API_BASE_URL } from '@/lib/config'

/**
 * Handles user sign-up.
 *
 * - Validates incoming form data.
 * - Checks for duplicate DNI.
 * - Registers the user with Supabase.
 * - Calls an RPC procedure to process the new user.
 *
 * @param formData - The incoming sign-up form data.
 * @returns A redirect response using encodedRedirect.
 */
export const signUpAction = async (formData: unknown) => {
  // Validate the incoming form data against the schema.
  const validatedData = signUpSchema.safeParse(formData)
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  if (!validatedData.success) {
    return encodedRedirect('error', '/sign-up', 'Datos ingresados incorrectos')
  }

  // Check if the provided DNI already exists.
  const { data: findedDNI } = await supabase
    .from('profiles')
    .select('dni')
    .eq('dni', validatedData.data.dni)

  if (findedDNI && findedDNI.length > 0) {
    return {
      status: 400,
      message: 'Ya existe un usuario con el DNI ingresado'
    }
  }

  const options = {
    emailRedirectTo: `${origin}/auth/callback`,
    data: {
      first_name: validatedData.data.firstName,
      paternal_last_name: validatedData.data.paternalLastName,
      maternal_last_name: validatedData.data.maternalLastName,
      birth_date: validatedData.data.birthdate,
      dni: validatedData.data.dni,
      level: validatedData.data.level,
      role: 'deportista',
      avatar_url: null,
      phone: validatedData.data.phone
    }
  }

  // Sign up the user using Supabase's auth API.
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: validatedData.data.email,
    password: validatedData.data.password,
    options
  })

  if (signupError) {
    console.error(signupError)
    return encodedRedirect('error', '/sign-up', signupError.message)
  }

  // Process the new user via an RPC call.
  const { error: rpcError } = await supabase.rpc('process_new_user', {
    p_id: signupData.user?.id,
    p_raw_user_meta_data: options.data
  })

  if (rpcError) {
    return encodedRedirect('error', '/sign-up', rpcError.message)
  }

  return encodedRedirect(
    'success',
    '/sign-up',
    'Gracias por registrarte. Por favor, verifica tu correo electrónico.'
  )
}

/**
 * Handles user sign-in.
 *
 * - Authenticates the user with email and password.
 * - Retrieves the user and profile information.
 * - Determines the correct redirect URL based on the user role.
 *
 * @param formData - A FormData object containing "email" and "password".
 * @returns An object with status and either a redirectUrl or an error message.
 */
export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  // Authenticate the user.
  const { error: signinError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (signinError) {
    return {
      status: 500,
      message: 'Error al iniciar sesión. Email o contraseña incorrectos.'
    }
  }

  // Retrieve the authenticated user.
  const { data: user } = await supabase.auth.getUser()
  if (!user) {
    return { status: 401, message: 'Usuario no encontrado' }
  }

  // Fetch the user's profile from the "profiles" table.
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user?.id)
    .single()

  // Determine the appropriate redirect URL based on the user's role.
  let redirectUrl = ''
  if (profile?.role === 'admin') {
    redirectUrl = '/dashboard/admin'
  } else if (profile?.role === 'deportista') {
    redirectUrl = '/loading-data'
  } else if (profile?.role === 'auxiliar_administrativo') {
    redirectUrl = '/dashboard/auxiliar'
  }

  return { status: 200, redirectUrl }
}

/**
 * Handles password reset request.
 *
 * - Sends a password reset email with a callback URL.
 * - If a callbackUrl is provided in the form data, redirects to it.
 *
 * @param formData - A FormData object containing "email" and optionally "callbackUrl".
 * @returns A redirect response or an encodedRedirect response.
 */
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString()
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const callbackUrl = formData.get('callbackUrl')?.toString()

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required')
  }

  // Initiate the password reset process.
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`
    }
  )

  if (resetError) {
    console.log(resetError.message)
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password'
    )
  }

  if (callbackUrl) {
    return redirect(callbackUrl)
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.'
  )
}

/**
 * Sends a password reset email directly from the change password form.
 *
 * @param email - The user's email address
 * @returns Object with success status and message
 */
export const sendPasswordResetEmail = async (email: string) => {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`
    }
  )

  if (resetError) {
    return {
      success: false,
      message: 'No se pudo enviar el correo de restablecimiento'
    }
  }

  return {
    success: true,
    message: 'Se ha enviado un enlace de restablecimiento a tu correo'
  }
}

/**
 * Resets the user's password.
 *
 * - Validates that the password and confirmation match.
 * - Updates the user's password using Supabase's auth API.
 *
 * @param formData - A FormData object containing "password" and "confirmPassword".
 * @returns An encodedRedirect response indicating success or error.
 */
export async function resetPasswordAction(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Passwords do not match'
    )
  }

  const supabase = await createClient()

  // Update the user's password.
  const { error: updateError } = await supabase.auth.updateUser({
    password
  })

  if (updateError) {
    return encodedRedirect(
      'error',
      '/protected/reset-password',
      'Password update failed'
    )
  }

  return encodedRedirect('success', '/sign-in', 'Password updated successfully')
}

/**
 * Signs out the current user.
 *
 * @returns A redirect response to the logout cleanup route.
 */
export const signOutAction = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/signout`, {
    credentials: 'include',
    method: 'POST'
  })
  if (!res.ok) {
    console.log('Error signing out:', res.statusText)
    throw new Error('Error signing out')
  }
  return redirect('/logout-cleanup')
}

/**
 * Retrieves a user profile by user ID.
 *
 * @param userId - The user's ID.
 * @returns The user profile data.
 */
export const getProfile = async (userId?: string): Promise<any> => {
  const supabase = await createClient()
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
    return profile
  }
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single()

  if (profileError) throw profileError

  return profile
}

/**
 * Represents a shift with basic properties.
 */
interface ReturnResponse {
  id: string
  name: string
  description: string
  spots: number
}

/**
 * Retrieves available shifts and associated schedules.
 *
 * - Retrieves all shifts and schedules from Supabase.
 * - Maps schedules to include related shift weekdays and description.
 *
 * @returns An array of shift objects or an error object.
 */
export const getShifts = async (): Promise<
  ReturnResponse[] | { status: number; data: any } | undefined
> => {
  const res = await fetch(`${API_BASE_URL}/users/shifts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await res.json()
  if (!res.ok) {
    console.log(data)
    return { status: res.status, data: null }
  }
  return data
}
