import { API_BASE_URL } from '@/lib/config'
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
  const response = await fetch(`${API_BASE_URL}/auth/${id}/change-password`, {
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

  console.log(response)
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword
  })
}
