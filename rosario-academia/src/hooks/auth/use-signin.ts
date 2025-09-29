import { AUTH_URL } from '@/lib/config'
import { signIn } from '@/utils/auth/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await signIn(credentials.email, credentials.password)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (error: Error) => {
      return {
        status: 500,
        message: error.message || 'Error al iniciar sesión'
      }
    }
  })
}
