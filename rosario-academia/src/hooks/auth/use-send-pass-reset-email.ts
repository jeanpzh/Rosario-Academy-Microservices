import { useMutation } from '@tanstack/react-query'

export async function sendPasswordResetEmail(email: string) {
  const response = await fetch('http://localhost:4003/auth/reset-password', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ email })
  })

  if (!response.ok) {
    throw new Error(
      'Error al enviar el correo de restablecimiento de contraseña'
    )
  }

  return response.json()
}

export async function useSendPasswordResetEmail(email: string) {
  return useMutation({
    mutationKey: ['sendPasswordResetEmail'],
    mutationFn: () => sendPasswordResetEmail(email),
    onMutate: () => {
      console.log('Sending password reset email...')
    },
    onSuccess: (data) => {
      console.log('Password reset email sent successfully:', data)
    },
    onError: (error) => {
      console.error('Error sending password reset email:', error)
    }
  })
}
