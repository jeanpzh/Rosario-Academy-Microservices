import {
  SignupSchema,
  SignupRequest
} from '@/app/(auth-pages)/schemas/sign-up-schema'
import { API_BASE_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSignUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: SignupSchema) => {
      const backendData: SignupRequest = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        paternalLastName: userData.paternalLastName,
        maternalLastName: userData.maternalLastName,
        birthdate: userData.birthdate,
        dni: userData.dni,
        phone: userData.phone,
        role: 'deportista',
        metadata: {
          level: userData.level,
          planId: userData.planId
        }
      }

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
      window.location.href = '/sign-in'
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (error: Error) => {
      console.log(error)
      toast.error(error.message || 'Error al registrarse')
      return {
        status: 500,
        message: error.message || 'Error al registrarse'
      }
    }
  })
}
