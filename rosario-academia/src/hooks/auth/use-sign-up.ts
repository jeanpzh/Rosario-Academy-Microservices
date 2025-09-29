import { type SignUpSchema } from '@/app/(auth-pages)/schemas/sign-up-schema'
import { AUTH_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSignUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: SignUpSchema) => {
      const backendData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        paternal_last_name: userData.paternalLastName,
        maternal_last_name: userData.maternalLastName,
        birth_date: userData.birthDate,
        dni: userData.dni,
        level: userData.level,
        phone: userData.phone,
        role: 'deportista'
      }
      const response = await fetch(`${AUTH_URL}/signup`, {
        method: 'POST',
        body: JSON.stringify(backendData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al registrarse')
      }
      return await response.json()
    },
    onSuccess: (data) => {
      /* Link con toast */
      toast.success('Registro exitoso', {
        description: 'Ya puedes iniciar sesión con tu cuenta.'
      })
      window.location.href = '/auth/sign-in'
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al registrarse')
      return {
        status: 500,
        message: error.message || 'Error al registrarse'
      }
    }
  })
}
