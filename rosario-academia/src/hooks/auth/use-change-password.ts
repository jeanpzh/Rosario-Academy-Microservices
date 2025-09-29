import { AUTH_URL } from '@/lib/config'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
const changePassword = async ({
  currentPassword,
  newPassword,
  id
}: {
  currentPassword: string
  newPassword: string
  id: string
}) => {
  const response = await fetch(`${AUTH_URL}/profile/${id}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Error al cambiar la contraseña')
  }

  return await response.json()
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Contraseña actualizada correctamente')
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar la contraseña', {
        description: error.message,
        duration: 5000
      })
    }
  })
}
