'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { changePassword } from '@/app/dashboard/actions/reutilizableActions'
import {
  changePasswordFormData,
  ChangePasswordFormData
} from '@/app/dashboard/schemas/change-password-schema'
import PasswordInput from '@/components/password-input'
import VerifyPassword from '@/app/(auth-pages)/components/VerifyPassword'
import { toast } from 'sonner'
import { sendPasswordResetEmail } from '@/app/(auth-pages)/actions'
/* import { useFetchProfileQuery } from "@/hooks/use-fetch-profile"; */
import LoadingPage from '@/components/LoadingPage'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import { useChangePassword } from '@/hooks/auth/use-change-password'

export function ChangePasswordForm() {
  const athleteDetails = useAthleteStore((state) => state.athleteDetails)
  const profile = athleteDetails?.profile
  const { handleSubmit, reset, control, watch } =
    useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordFormData)
    })
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const mutation = useChangePassword()
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true)

      const { currentPassword, newPassword } = data
      await mutation.mutateAsync({
        currentPassword,
        newPassword,
        id: profile?.id as string
      })
      toast.success('Contraseña actualizada correctamente')
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error)
      throw new Error('Error al cambiar la contraseña')
    } finally {
      setIsLoading(false)
    }

    reset()
  }

  const handleForgotPassword = async () => {
    if (!profile?.email) {
      toast.error('Error', {
        description: 'No se encontró el correo electrónico',
        duration: 5000
      })
      return
    }

    setIsResetting(true)
    try {
      const { success, message } = await sendPasswordResetEmail(profile.email)
      if (success) {
        toast.success('Éxito', {
          description: message,
          duration: 5000
        })
      } else {
        toast.error('Error', {
          description: message,
          duration: 5000
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('Error', {
        description:
          'Hubo un problema al enviar el correo. Por favor, intenta de nuevo.',
        duration: 5000
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Card className='space-y-2 p-6'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Cambiar Contraseña
        </CardTitle>
        <CardDescription className='text-muted-foreground'>
          Asegúrate de que tu nueva contraseña sea segura y única.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <PasswordInput
            label='Contraseña Actual'
            control={control}
            id='currentPassword'
            name='currentPassword'
            htmlFor='currentPassword'
          />
          <Button
            variant={'link'}
            className='text-blue-500'
            onClick={handleForgotPassword}
            disabled={isResetting || !profile?.email}
          >
            {isResetting
              ? 'Enviando solicitud...'
              : '¿Olvidaste tu contraseña?'}
          </Button>
          <PasswordInput
            label='Nueva Contraseña'
            control={control}
            id='newPassword'
            name='newPassword'
            htmlFor='newPassword'
          />
          <VerifyPassword password={watch('newPassword', '')} />
          <PasswordInput
            label='Confirmar Contraseña'
            control={control}
            id='confirmPassword'
            name='confirmPassword'
            htmlFor='confirmPassword'
          />

          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
