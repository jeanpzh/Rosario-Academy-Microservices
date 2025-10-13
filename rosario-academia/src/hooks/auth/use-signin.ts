import { signIn } from '@/utils/auth/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  createAuthError,
  DniNotVerifiedError,
  EmailNotConfirmedError
} from '@/lib/errors'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const { push } = useRouter()
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await signIn(credentials.email, credentials.password)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)
      toast.success('Inicio de sesión exitoso', {
        description: 'Bienvenido de nuevo!'
      })
      push('/dashboard')
    },
    onError: (error: Error) => {
      const authError = createAuthError(error.message)

      if (authError instanceof EmailNotConfirmedError) {
        toast.error('Email no confirmado', {
          description: error.message,
          duration: 6000
        })
      } else {
        toast.error('Error al iniciar sesión', {
          description: error.message || 'Credenciales inválidas'
        })
      }
    }
  })
}
