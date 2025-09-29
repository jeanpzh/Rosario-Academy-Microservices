import { USER_URL } from '@/lib/config'
import { useMutation } from '@tanstack/react-query'

const generateVerificationCode = async (userId: string) => {
  console.log('Generating verification code for user:', userId)
  const response = await fetch(
    `${USER_URL}/athlete/${userId}/generate-verification-code`,
    {
      method: 'POST',
      credentials: 'include'
    }
  )
  if (!response.ok) {
    throw new Error('Failed to generate verification code')
  }
  const data = await response.json()
  return data
}

export function useGenerateVerificationId({
  setVerificationId,
  userId
}: {
  setVerificationId: (data: string) => void
  userId: string
}) {
  return useMutation({
    mutationKey: ['generateVerificationId'],
    mutationFn: () => generateVerificationCode(userId),
    onSuccess: (data) => {
      if (data.status === 200) setVerificationId(data.data)
    }
  })
}
