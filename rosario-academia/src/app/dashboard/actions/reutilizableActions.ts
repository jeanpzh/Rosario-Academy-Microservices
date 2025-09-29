'use server'
import { PAYMENT_URL } from '@/lib/config'
import { getProfile } from '@/utils/auth/api'
import { getDaysRemaining } from '@/utils/formats'
import { createClient, getServiceClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

export const getToken = async () => {
  try {
    const cookieStore = await cookies()
    return cookieStore.get('auth_session')?.value
  } catch (error) {
    console.error('Error al obtener la cookie:', error)
    return null
  }
}

export const getProfileData = async () => {
  const token = await getToken()
  if (!token) {
    console.error('No auth token found')
    return null
  }

  const data = await getProfile(token)

  if (!data) {
    console.error('No profile data received')
    return null
  }
  return data
}

export const getEnrollmentInfo = async (id: string) => {
  if (!id || id === 'undefined') {
    console.error('Invalid athlete ID provided:', id)
    return null
  }
  const res = await fetch(
    `${PAYMENT_URL}/payment/athlete/${id}/enrollment-requests`,
    {
      credentials: 'include'
    }
  )
  if (!res.ok) {
    console.error('Error fetching enrollment info:', res.statusText)
    return null
  }
  const { data, success } = await res.json()
  if (!success) {
    console.error('Error fetching enrollment info:', data)
    return null
  }
  return data
}

/**
 * Send an email with the assistant's credentials using Resend.
 *
 * @param recipientEmail - The email address to send to.
 * @param firstName - The first name of the assistant.
 * @param defaultPassword - The default password generated.
 * @throws An error if sending the email fails.
 */

export const sendEmail = async (
  recipientEmail: string,
  firstName: string,
  defaultPassword: string,
  role: string
) => {
  const resend = new Resend(process.env.RESEND_API_KEY as string)
  try {
    await resend.emails.send({
      from: 'Tu Servicio <no-reply@fisib22.com>',
      to: recipientEmail,
      subject: `Cuenta de ${role} - Credenciales de Acceso`,
      html: `<p>Hola ${firstName},</p>
             <p>Se ha creado tu cuenta como ${role}.</p>
             <p>Estas son tus credenciales:</p>
             <ul>
               <li><strong>Email:</strong> ${recipientEmail}</li>
               <li><strong>Contraseña:</strong> ${defaultPassword}</li>
             </ul>
             <p>Cambia tu contraseña en el primer inicio de sesión.</p>`
    })
  } catch (sendError) {
    console.error('Error enviando el email:', sendError)
    throw new Error('Error enviando email')
  }
}
/**
 * Action for changing an assistant's password.
 *
 * This function verifies the current password, updates to the new password,
 * and then reauthenticates the user with the new password.
 *
 * @param currentPassword - The current password.
 * @param newPassword - The new password to set.
 * @returns An object indicating whether the password change was successful.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const client = await getServiceClient()
    const supaAdmin = await createClient()
    const { data: session, error: sessionError } =
      await supaAdmin.auth.getUser()

    if (sessionError || !session?.user?.email) {
      return { success: false, message: 'No se encontró una sesión activa' }
    }
    // GET USER PROFILE
    const { data: userProfile, error: profileError } = await client
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (profileError || !userProfile) {
      return { success: false, message: 'No se encontró el perfil del usuario' }
    }
    // if the last password change is less than 15 days ago, return an error "No puedes cambiar tu contraseña hasta ..."
    const lastPasswordChange = userProfile.last_password_change
    const daysRemaining = getDaysRemaining(lastPasswordChange as string, 15)

    if (daysRemaining > 0) {
      return {
        success: false,
        message: `No puedes cambiar tu contraseña hasta ${daysRemaining} días`
      }
    }

    const { error: signInError } = await supaAdmin.auth.signInWithPassword({
      email: session.user.email,
      password: currentPassword
    })

    if (signInError) {
      return { success: false, message: 'Contraseña actual incorrecta' }
    }

    const { error: updateError } = await client.auth.admin.updateUserById(
      session.user.id,
      {
        password: newPassword
      }
    )
    if (updateError) {
      return { success: false, message: 'Error actualizando la contraseña' }
    }

    const { error: reauthError } = await supaAdmin.auth.signInWithPassword({
      email: session.user.email,
      password: newPassword
    })
    if (reauthError) {
      return { success: false, message: 'Error reautenticando' }
    }
    // Update the last password change date
    const { error: updateProfileError } = await client
      .from('profiles')
      .update({ last_password_change: new Date().toISOString() })
      .eq('id', session.user.id)
    if (updateProfileError) {
      return { success: false, message: 'Error actualizando el perfil' }
    }

    return { success: true, message: 'Contraseña actualizada correctamente' }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    console.error(error)
    return { success: false, message: 'Error interno del servidor' }
  }
}
