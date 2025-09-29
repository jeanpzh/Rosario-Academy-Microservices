import { AUTH_URL, PAYMENT_URL, USER_URL } from '@/lib/config'

export interface UserMetaData {
  role: 'athlete' | 'auxiliar_administrativo' | 'admin'
  full_name: string
  birth_date: string
  dni: string
  email: string
  email_verified: boolean
  first_name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  maternal_last_name: string
  paternal_last_name: string
  phone: string
  phone_verified: boolean
  sub: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: UserMetaData
}

export async function getProfile(token: string) {
  try {
    const response = await fetch(`${AUTH_URL}/profile`, {
      headers: { Cookie: `auth_session=${token}` }
    })
    if (!response.ok) {
      throw new Error('Error al obtener el perfil')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener el perfil:', error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${AUTH_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al iniciar sesión')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function signUp(email: string, password: string, role: string) {
  try {
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al registrarse')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function updateProfile(
  data: {
    firstName: string
    paternalLastName: string
    maternalLastName: string
    phone: string
  },
  id: string
) {
  try {
    const response = await fetch(`${USER_URL}/profile/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    const da = await response.json()
    return da
  } catch (error) {
    console.log('Error updating profile:', error)
    throw error
  }
}
export async function getLastProfileUpdateDate(id: string) {
  const res = await fetch(`${USER_URL}/profile/${id}/last-profile-update`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error(
      'Error al obtener la última fecha de actualización del perfil'
    )
  }
  const { status, data } = await res.json()
  return { status, data }
}

export async function uploadImage(blob: Blob | null, id: string) {
  if (!blob) {
    throw new Error('No image selected')
  }
  const formData = new FormData()
  formData.append('file', blob, 'avatar.jpg')

  try {
    const response = await fetch(`${USER_URL}/profile/${id}/change-avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error uploading image')
    }

    return await response.json()
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}
export async function getPreferenceInitPoint(
  athleteId: string,
  scheduleId: string,
  email: string
) {
  try {
    const response = await fetch(`${PAYMENT_URL}/payment/create-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athleteId, scheduleId , email}),
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error.message ||
          'Error al obtener el punto de inicialización de la preferencia'
      )
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(
      'Error al obtener el punto de inicialización de la preferencia:',
      error
    )
    throw error
  }
}
