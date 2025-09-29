'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchProfileQuery } from '@/hooks/use-fetch-profile'
import { useAdmin } from '../admin/provider'

export default function Profile() {
  const { user } = useAdmin()
  console.log('User:', user)

  const profile = user.user_metadata

  if (!user) {
    return (
      <Card className='my-auto h-96'>
        <CardContent className='flex items-center space-x-4 pt-6'>
          <p className='text-sm text-muted-foreground'>
            No se pudo cargar el perfil
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='my-auto h-96'>
      <CardContent className='flex h-auto flex-col items-center space-y-4 pt-6'>
        <Avatar className='size-20'>
          <AvatarImage
            src={user.avatar_url || '/avatar-placeholder.png'}
            alt='Avatar del administrador'
          />
          <AvatarFallback>
            {profile.first_name?.charAt(0)}
            {profile.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className='text-center'>
          <h3 className='text-xl font-semibold'>
            {profile.first_name} {profile.last_name}
          </h3>
          <p className='text-sm text-muted-foreground'>{profile.email}</p>
          <p className='text-lg font-medium text-primary'>
            Rol:{' '}
            {profile.role === 'admin'
              ? 'Administrador'
              : 'Auxiliar Administrativo'}
          </p>
        </div>
        <div className='w-full space-y-2 text-base text-muted-foreground'>
          <p>
            Fecha de Nacimiento:{' '}
            {profile.birth_date
              ? new Date(profile.birth_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'No especificada'}
          </p>
          <p>DNI: {profile.dni || 'No especificado'}</p>
          <p>Teléfono: {profile.phone || 'No especificado'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
