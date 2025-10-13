import { AthleteFormData } from '@/app/dashboard/schemas/athlete-schema'
import { API_BASE_URL } from '@/lib/config'
import { useAthleteModalStore } from '@/lib/stores/useAthleteStore'
import { useModalStore } from '@/lib/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const addAthlete = async (data: AthleteFormData, file?: Blob | null) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string)
    }
  })

  if (file) {
    formData.append('file', file)
  }

  const response = await fetch(`${API_BASE_URL}/users/athlete`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Error al registrar deportista')
  }
  return result
}

export const useAddAthleteMutation = () => {
  const { closeModal, setOpenModal } = useModalStore()
  const setCurrentItem = useAthleteModalStore((state) => state.setCurrentItem)

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['addAthlete'],
    mutationFn: async (variables: {
      data: AthleteFormData
      file: Blob | null
    }) => {
      return addAthlete(variables.data, variables.file)
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      closeModal()
      setCurrentItem(user.data)
      setOpenModal('CREATE_PAYMENT')
      toast.success('Deportista registrado con éxito', {
        description: '¿El deportista hizo algún pago?'
      })
    },

    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  })
}
