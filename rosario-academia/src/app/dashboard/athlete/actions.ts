'use server'
import { createClient } from '@/utils/supabase/server'
import { editFormSchema } from '@/app/dashboard/athlete/schemas/edit-form-schema'
import { MP } from '.'
import { BASE_URL } from '@/lib/config'
import { Preference } from 'mercadopago'

type ActionResponse = {
  status: number
  message: string
  data?: any
}

export const editProfileAction = async (
  data: unknown
): Promise<ActionResponse> => {
  try {
    const validatedData = editFormSchema.safeParse(data)

    if (!validatedData.success) {
      return {
        status: 400,
        message: 'Datos ingresados incorrectos'
      }
    }

    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      return {
        status: 404,
        message: 'Usuario no encontrado'
      }
    }
    // Verify if last_profile_update is more than 30 days
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single()

    if (profileError) {
      return {
        status: 500,
        message: profileError.message
      }
    }
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    const lastUpdate = new Date(profile.last_profile_update).getTime()
    const currentDate = new Date().getTime()

    if (currentDate - lastUpdate < thirtyDays) {
      return {
        status: 400,
        message: 'Solo puedes actualizar tu perfil una vez al mes'
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: validatedData.data.firstName,
        paternal_last_name: validatedData.data.paternalLastName,
        maternal_last_name: validatedData.data.maternalLastName,
        phone: validatedData.data.phone,
        last_profile_update: new Date()
      })
      .eq('id', userData.user.id)
      .single()

    if (error) {
      return {
        status: 500,
        message: error.message
      }
    }

    return {
      status: 200,
      message: 'Perfil actualizado correctamente'
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Error interno del servidor'
    }
  }
}

export const submit = async (id: string, schedule_id: string) => {
  try {
    const preference = await new Preference(MP).create({
      body: {
        items: [
          {
            id: '1234',
            title: 'Pago de Matrícula y Suscripción - Academia Rosario',
            quantity: 1,
            currency_id: 'PEN',
            description:
              'Pago para inscripción y creación/renovación de suscripción',
            unit_price: 2
          }
        ],
        metadata: {
          athlete_id: id,
          schedule_id: schedule_id,
          payment_type: 'subscription'
        },
        back_urls: {
          success: `${BASE_URL}/dashboard/athlete/payments`,
          failure: `${BASE_URL}/dashboard/athlete/payments`,
          pending: `${BASE_URL}/dashboard/athlete/payments`
        },
        auto_return: 'approved'
      }
    })
    return preference.init_point
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}
