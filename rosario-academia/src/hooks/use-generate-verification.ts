import { API_BASE_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

interface VerificationCodeResponse {
  verificationId: string
}

const generateVerificationCode = async ({
  userId
}: {
  userId: string
}): Promise<VerificationCodeResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/athletes/${userId}/generate-verification-code`,
    {
      method: 'POST',
      credentials: 'include'
    }
  )
  if (!response.ok) {
    console.log('Response not ok:', response)
    throw new Error('Failed to generate verification code')
  }
  const data = await response.json()
  console.log('Generated verification code:', data)
  return data
}

export function useGenerateVerificationId({ userId }: { userId: string }) {
  return useQuery<VerificationCodeResponse>({
    queryKey: ['verificationCode', userId],
    queryFn: () => generateVerificationCode({ userId }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 2
  })
}
