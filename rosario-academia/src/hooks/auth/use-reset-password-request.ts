import { API_BASE_URL } from '@/lib/config'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ResetPasswordResponse {
  success: boolean
  message: string
}

const resetPasswordRequest = async (
  email: string
): Promise<ResetPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      error.message || 'Error al enviar la solicitud de restablecimiento'
    )
  }

  return response.json()
}

export function useResetPasswordRequest() {
  return useMutation({
    mutationKey: ['resetPasswordRequest'],
    mutationFn: resetPasswordRequest,
    onSuccess: (data) => {
      toast.success('Éxito', {
        description: data.message,
        duration: 5000
      })
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message,
        duration: 5000
      })
    }
  })
}
