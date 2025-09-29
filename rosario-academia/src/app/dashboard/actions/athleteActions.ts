'use server'

import { createClient, getServiceClient } from '@/utils/supabase/server'
import {
  AthleteFormData,
  athleteFormSchema
} from '@/app/dashboard/schemas/athlete-schema'
import { v4 as uuidv4 } from 'uuid'
import { getProfile } from '@/app/(auth-pages)/actions'
import crypto from 'crypto'
import { PaymentMethod } from '@/lib/types/PaymentMethod'
import { Athlete } from '@/lib/types/AthleteTable'
import { sendEmail } from './reutilizableActions'
import { USER_URL } from '@/lib/config'

/**
 * Retrieves the athlete's enrollment information.
 * @returns Enrollment data for the athlete.
 * @throws Error if the enrollment data cannot be retrieved.
 */
export async function getEnrollmentAction(userId: string) {
  const supabase = await getServiceClient()
  const { data, error } = await supabase
    .from('enrollment_requests')
    .select('*')
    .eq('athlete_id', userId)
    .single()
  if (error) {
    throw new Error('Error al obtener matrícula de deportista')
  }
  return data
}

export async function getPaymentMethods() {
  const supabase = await getServiceClient()
  const { data, error } = await supabase.from('payment_methods').select('*')
  if (error) {
    throw new Error('Error al obtener métodos de pago')
  }
  return data
}

/**
 * Retrieves the payments made by the athlete.
 * @returns Payments data for the athlete.
 * @throws Error if the payments cannot be retrieved.
 */
export async function getPaymentsAction(userId: string) {
  const supabase = await getServiceClient()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('athlete_id', userId)
  if (error) {
    console.error(error)
    throw new Error('Error al obtener pagos de deportista')
  }
  return data
}
/**
 * Retrieves the payments made by the athlete with the payment method name.
 * @returns   Payments data for the athlete with the payment method name.
 * @throws  Error if the payments cannot be retrieved.
 */

export async function getPaymentsWithMethods(userId: string): Promise<any[]> {
  const payments = await getPaymentsAction(userId)
  const paymentMethods = await getPaymentMethods()
  return payments.map((payment: Payment) => {
    const method = paymentMethods.find(
      (paymentMethod: Payment) =>
        paymentMethod.payment_method_id === payment.payment_method_id
    )
    return { ...payment, payment_method: method?.method_name }
  })
}

/**
 * Retrieves the athlete's subscription details.
 * @returns Subscription data for the athlete.
 * @throws Error if the subscription data cannot be retrieved.
 */
export async function getSubscription(userId: string) {
  const supabase = await getServiceClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('athlete_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    throw new Error('Error al obtener suscripción de deportista')
  }
  return data
}

/**
 * Retrieves the current athlete's ID.
 * @returns The athlete's user ID.
 * @throws Error if the athlete's ID is not found.
 */
/* export async function getAthleteId(): Promise<string> {
  const user = await getUser()
  if (!user?.id) {
    throw new Error('ID de deportista no encontrado')
  }
  return user.id
} */

/**
 * Updates the athlete's profile with the provided form data.
 * @param formData - The new data to update.
 * @param id - The athlete's profile ID.
 * @returns The updated profile data.
 * @throws Error if the profile update fails.
 */
export async function updateAthleteAction(formData: unknown, id: string) {
  // Validate the form data using the athlete schema.
  const validated = athleteFormSchema.safeParse(formData)
  if (!validated.success) {
    return { error: 'Datos ingresados incorrectos' }
  }
  try {
    const supabase = await getServiceClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: validated.data.first_name,
        paternal_last_name: validated.data.paternal_last_name,
        maternal_last_name: validated.data.maternal_last_name,
        birth_date: validated.data.birth_date,
        dni: validated.data.dni,
        phone: validated.data.phone,
        email: validated.data.email,
        avatar_url: validated.data.avatar_url,
        last_profile_update: new Date(),
        last_avatar_change: new Date()
      })
      .eq('id', id)

    if (error) {
      throw new Error('Error al actualizar perfil')
    }
    return data
  } catch (error) {
    throw error
  }
}

/**
 * Deletes an athlete using the provided user ID.
 * @param id - The athlete's user ID.
 * @returns A status message confirming deletion.
 * @throws Error if the deletion fails.
 */
export async function deleteAthleteAction(id: string) {
  const res = await fetch(`${USER_URL}/athlete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error('Error al eliminar deportista')
  }
  return { status: 200, message: 'Deportista eliminado correctamente' }
}

/**
 * Retrieves the list of athletes by calling an RPC procedure.
 * @returns The list of athletes.
 * @throws Error if the retrieval fails.
 */
  export async function getAthletesAction() {
    const res = await fetch(`${USER_URL}/athletes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!res.ok) {
      throw new Error('Error al obtener deportistas')
    }
    const { data, error } = await res.json()
    if (error) {
      throw new Error('Error al obtener deportistas')
    }
    return data
  }

/**
 * Updates the enrollment status for a given athlete.
 * @param id - The athlete's user ID.
 * @param status - The new enrollment status.
 * @returns The updated enrollment data.
 * @throws Error if the update fails.
 */
export async function updateStatusAthleteAction(id: string, status: string) {
  const supabase = await getServiceClient()
  const { data, error } = await supabase
    .from('enrollment_requests')
    .update({ status })
    .eq('athlete_id', id)
  if (error) {
    console.error('Error updating status', error)
    throw new Error('Error updating status')
  }
  return data
}

/**
 * Updates the athlete's level.
 * @param id - The athlete's user ID.
 * @param level - The new level (e.g., beginner, intermediate, advanced).
 * @returns The updated athlete data.
 * @throws Error if the update fails.
 */
export async function updateLevelAthleteAction(id: string, level: string) {
  const supabase = await getServiceClient()
  const { data, error } = await supabase
    .from('athletes')
    .update({ level })
    .eq('athlete_id', id)
  if (error) {
    console.error('Error updating level', error)
    throw new Error('Error updating level')
  }
  return data
}

/**
 * Retrieves the count of registered athletes.
 * @returns The number of athletes.
 * @throws Error if the count cannot be retrieved.
 */
export async function getAthletesCount() {
  const supabase = await getServiceClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'deportista')
  if (error) {
    throw new Error('Error al obtener el conteo de deportistas')
  }
  return data.length
}

/**
 * Retrieves the distribution of athletes by level.
 * @returns An object with counts for beginner, intermediate, and advanced levels.
 * @throws Error if the distribution data cannot be retrieved.
 */
export async function getAthleteDistribution() {
  const supabase = await getServiceClient()
  const { data, error } = await supabase.from('athletes').select('level')
  if (error) {
    throw new Error('Error al obtener la distribución de deportistas')
  }
  const levels = data.map((athlete: any) => athlete.level)
  const beginner = levels.filter((level: string) => level === 'beginner').length
  const intermediate = levels.filter(
    (level: string) => level === 'intermediate'
  ).length
  const advanced = levels.filter((level: string) => level === 'advanced').length
  return { beginner, intermediate, advanced }
}

/**
 * Generates or returns an existing verification code for the athlete.
 * @returns An object containing a status code and the verification code.
 * @throws Error if the verification code generation fails.
 */
/* export async function generateVerificationCode() {
  // Retrieve the current athlete's ID.
  const athleteId = await getAthleteId()
  const supabase = await getServiceClient()

  // Check if a verification_id already exists.
  const { data: athlete, error } = await supabase
    .from('athletes')
    .select('verification_id')
    .eq('athlete_id', athleteId)
    .single()
  if (error) {
    throw new Error('Error al obtener datos del deportista')
  }
  if (athlete.verification_id) {
    return { status: 200, data: athlete.verification_id }
  }

  // Generate a new verification_id and update the athlete's record.
  const verification_id = uuidv4()
  const { error: updateError } = await supabase
    .from('athletes')
    .update({ verification_id })
    .eq('athlete_id', athleteId)
  if (updateError) {
    throw new Error('Error al generar código de verificación')
  }
  return { status: 200, data: verification_id }
}
 */
/**
 * Retrieves the athlete's payment start date from their subscription.
 * @returns An object containing a status code and the subscription start date (or null).
 */
/* export async function getPaymentDate() {
  const athleteId = await getAthleteId()
  const supabase = await getServiceClient()
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('start_date')
    .eq('athlete_id', athleteId)
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    return { status: 500, data: null }
  }
  if (!subscription) {
    return { status: 200, data: null }
  }
  return { status: 200, data: subscription.start_date }
} */

/**
 * Retrieves the date of the athlete's last avatar change.
 * @returns An object containing a status code and the last avatar change date.
 * @throws Error if the profile data cannot be retrieved.
 */
/* export async function getLastAvatarDate() {
  const athleteId = await getAthleteId()
  const supabase = await getServiceClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_avatar_change')
    .eq('id', athleteId)
    .single()
  if (error) {
    throw new Error('Error al obtener datos de perfil')
  }
  return { status: 200, data: profile.last_avatar_change }
} */

/**
 * Retrieves the date of the athlete's last profile update.
 * @returns An object containing a status code and the last profile update date.
 * @throws Error if the profile data cannot be retrieved.
 */
/* export async function getLastProfileUpdateDate() {
  const athleteId = await getAthleteId()
  const supabase = await getServiceClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_profile_update')
    .eq('id', athleteId)
    .single()
  if (error) {
    throw new Error('Error al obtener datos de perfil')
  }
  return { status: 200, data: profile.last_profile_update }
} */

/**
 * Retrieves all payment-related data for the current athlete.
 * Executes multiple asynchronous actions in parallel.
 * @returns An object containing user data, payments, profile, enrollment, and subscription data.
 */
/* export async function getAllPaymentData() {
  // Retrieve the current user (needed for all other actions).
  const user = await getUser()

  // Execute all actions concurrently using Promise.all
  const [payments, profile, enrollment, subscriptionData] = await Promise.all([
    getPaymentsAction(user.id),
    getProfile(user.id),
    getEnrollmentAction(user.id),
    getSubscription(user.id)
  ])

  return { user, payments, profile, enrollment, subscriptionData }
} */

/**
 *  Creates a new athlete profile with the provided form data.
 *  @param data - The new data to create the profile.
 *  @returns The new profile data.
 * @throws Error if the profile creation fails.
 */

const generateRandomPassword = (bytes = 16): string =>
  crypto.randomBytes(bytes).toString('hex')

/* export const addAthlete = async (data: AthleteFormData, file: Blob | null) => {
  if (!file) {
    return { error: 'No se proporcionó la imagen del avatar' }
  }

  const validated = athleteFormSchema.safeParse(data)
  if (!validated.success) return { error: 'Datos ingresados incorrectos' }

  const supabase = await getServiceClient()
  const password = generateRandomPassword()

  const options = {
    data: {
      first_name: validated.data.first_name,
      paternal_last_name: validated.data.paternal_last_name,
      maternal_last_name: validated.data.maternal_last_name,
      birth_date: validated.data.birth_date,
      dni: validated.data.dni,
      level: validated.data.level,
      role: 'deportista',
      avatar_url: null,
      phone: validated.data.phone
    }
  }

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: validated.data.email as string,
    password: password
  })

  if (signupError || !signupData) {
    return { error: 'Error al registrar deportista' }
  }
  await sendEmail(
    validated.data.email as string,
    validated.data.first_name,
    password,
    'deportista'
  )

  const { error: rpcError } = await supabase.rpc('process_new_user', {
    p_id: signupData.user?.id,
    p_raw_user_meta_data: options.data
  })
  if (rpcError) {
    return { error: 'Error al registrar deportista' }
  }
  await saveAvatar(file, signupData.user?.id)
  return {
    status: 200,
    message: 'Deportista registrado correctamente',
    data: signupData.user
  }
} */

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('payment_methods').select('*')

  if (error) throw error
  return data as PaymentMethod[]
}

export async function createPaymentRecord(
  athleteId: string,
  formData: Payment
) {
  const supabase = await createClient()

  // Crear registro de suscripción
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      athlete_id: athleteId,
      start_date: formData.subscription_start_date,
      end_date: formData.subscription_end_date,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (subscriptionError) throw subscriptionError

  // Crear registro de pago vinculado a la suscripción
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      athlete_id: athleteId,
      amount: formData.amount,
      payment_date: formData.payment_date,
      payment_method_id: formData.payment_method_id,
      transaction_reference: formData.transaction_reference,
      subscription_id: subscription.id
    })
    .select()
    .single()

  if (paymentError) throw paymentError

  // Actualizar el estado de la solicitud de inscripción
  const { error: updateError } = await supabase
    .from('enrollment_requests')
    .update({ status: 'approved' })
    .eq('athlete_id', athleteId)

  if (updateError) throw updateError

  return { payment, subscription }
}
export async function getAthleteById(athleteId: string): Promise<Athlete> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', athleteId)
    .single()

  if (error) throw error
  return data
}
/* 


*/
export async function getAthletesWithPayments(): Promise<any[] | null> {
  const supabase = await createClient()

  const { data: athletes, error } = await supabase.from('athletes').select(
    `
      athlete_id,
      profiles (
        first_name,
        paternal_last_name,
        maternal_last_name,
        avatar_url
      ),
      payments (
        amount,
        payment_date,
        payment_methods (
          method_name
        )
      )
    `
  )
  if (error || !athletes) {
    console.error(error)
    return null
  }
  return athletes
}
