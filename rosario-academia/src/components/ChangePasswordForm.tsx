'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  changePasswordFormData,
  ChangePasswordFormData
} from '@/app/dashboard/schemas/change-password-schema'
import PasswordInput from '@/components/password-input'

import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { useChangePassword } from '@/hooks/auth/use-change-password'
import { useResetPasswordRequest } from '@/hooks/auth/use-reset-password-request'
import VerifyPassword from '@/app/(auth-pages)/sign-up/components/VerifyPassword'
import { useFetchFullProfile } from './layout/dashboard/hooks/use-fetch-full-profile'

export function ChangePasswordForm({ userId }: { userId: string }) {
  const { data: profile, error: profileError } = useFetchFullProfile({
    userId: userId
  })
  const { handleSubmit, reset, control, watch } =
    useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordFormData)
    })

  const { mutateAsync: changePassword, isPending: isLoading } =
    useChangePassword()
  const { mutateAsync: resetPasswordRequest, isPending: isResettingPassword } =
    useResetPasswordRequest()

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const { currentPassword, newPassword } = data
      await changePassword({
        currentPassword,
        newPassword,
        id: userId
      })
      toast.success('Contraseña actualizada correctamente')
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error)
      throw new Error('Error al cambiar la contraseña')
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

    try {
      await resetPasswordRequest(profile.email)
    } catch (error) {
      console.error('Error requesting password reset:', error)
    }
  }

  if (profileError) {
    return <div>Error al cargar el perfil</div>
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
            type='button'
            onClick={handleForgotPassword}
            disabled={isResettingPassword || !profile?.email}
          >
            {isResettingPassword
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
