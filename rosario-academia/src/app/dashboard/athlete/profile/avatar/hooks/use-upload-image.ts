import { USER_URL } from '@/lib/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function uploadImage(blob: Blob | null, id: string) {
  if (!blob) {
    throw new Error('No image selected')
  }
  const formData = new FormData()
  formData.append('file', blob, 'avatar.jpg')

  try {
    const response = await fetch(`${USER_URL}/${id}/avatar`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error uploading image')
    }

    return await response.json()
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: ({ blob, id }: { blob: Blob | null; id: string }) =>
      uploadImage(blob, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullProfile'] })
    }
  })
}
