import { USER_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type UpdateProfileVariables = {
  data: Partial<User>
  id: string
}

const updateProfile = async ({ data, id }: UpdateProfileVariables) => {
  console.log('Updating profile with data:', data)
  const response = await fetch(`${USER_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error updating profile')
  }

  return await response.json()
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}
