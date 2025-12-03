import { signIn } from '@/utils/auth/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createAuthError,
  DniNotVerifiedError,
  EmailNotConfirmedError
} from '@/lib/errors'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await signIn(credentials.email, credentials.password)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)
      toast.success('Inicio de sesión exitoso', {
        description: 'Bienvenido de nuevo!'
      })
      // Usar window.location.href para forzar hard navigation
      // Esto es necesario porque las cookies HTTP-only no son visibles
      // para el router del cliente, y el middleware necesita una nueva
      // solicitud al servidor para validar la autenticación
      window.location.href = '/dashboard'
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
