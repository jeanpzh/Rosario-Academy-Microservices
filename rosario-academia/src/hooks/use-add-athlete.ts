import { AthleteFormData } from '@/app/dashboard/schemas/athlete-schema'
import { AUTH_URL } from '@/lib/config'
import { useAthleteModalStore } from '@/lib/stores/useAthleteStore'
import { useModalStore } from '@/lib/stores/useModalStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const addAthlete = async (data: AthleteFormData) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string)
  })

  const response = await fetch(`${AUTH_URL}/athlete`, {
    method: 'POST',
    body: formData
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Error al registrar deportista')
  }
  return result
}

export const useAddAthleteMutation = () => {
  const { closeModal, setOpenModal } = useModalStore()
  const { setCurrentItem } = useAthleteModalStore()

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['addAthlete'],
    mutationFn: async (variables: {
      data: AthleteFormData
      file: Blob | null
    }) => {
      return addAthlete(variables.data)
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
